<?php
/**
 * Plugin Name: Town of Ninety Six Headless CMS
 * Description: Staff-editable content types and a headless snapshot API for the Town of Ninety Six Next.js website.
 * Version: 0.1.0
 * Author: Town of Ninety Six
 */

defined('ABSPATH') || exit;

final class Ninety_Six_Headless_CMS {
	private const REST_NAMESPACE = 'ninety-six/v1';
	private const POST_SERVICE = 'n96_service';
	private const POST_ALERT = 'n96_alert';
	private const POST_EVENT = 'n96_event';
	private const POST_MEETING = 'n96_meeting';
	private const POST_DEPARTMENT = 'n96_department';
	private const POST_OFFICIAL = 'n96_official';
	private const POST_STAFF = 'n96_staff';
	private const POST_DOCUMENT = 'n96_document';
	private const POST_EXTERNAL_LINK = 'n96_external_link';

	public static function boot(): void {
		add_action('init', [__CLASS__, 'register_content_types']);
		add_action('init', [__CLASS__, 'register_meta_fields']);
		add_action('add_meta_boxes', [__CLASS__, 'add_meta_boxes']);
		add_action('save_post', [__CLASS__, 'save_meta'], 10, 2);
		add_action('rest_api_init', [__CLASS__, 'register_rest_routes']);
		add_filter('enter_title_here', [__CLASS__, 'title_placeholder'], 10, 2);
	}

	public static function register_content_types(): void {
		foreach (self::post_type_config() as $post_type => $config) {
			$args = [
				'labels' => [
					'name' => $config['plural'],
					'singular_name' => $config['singular'],
					'add_new_item' => 'Add New ' . $config['singular'],
					'edit_item' => 'Edit ' . $config['singular'],
					'new_item' => 'New ' . $config['singular'],
					'view_item' => 'View ' . $config['singular'],
					'search_items' => 'Search ' . $config['plural'],
					'not_found' => 'No ' . strtolower($config['plural']) . ' found',
				],
				'public' => false,
				'show_ui' => true,
				'show_in_menu' => true,
				'show_in_rest' => true,
				'menu_position' => $config['position'],
				'menu_icon' => $config['icon'],
				'supports' => $config['supports'] ?? ['title', 'editor', 'excerpt', 'revisions', 'page-attributes'],
				'has_archive' => false,
				'query_var' => false,
				'rewrite' => false,
			];

			if (!empty($config['template'])) {
				$args['template'] = $config['template'];
				$args['template_lock'] = false;
			}

			register_post_type(
				$post_type,
				$args
			);
		}
	}

	public static function register_meta_fields(): void {
		foreach (self::field_config() as $post_type => $fields) {
			foreach ($fields as $key => $field) {
				register_post_meta(
					$post_type,
					$key,
					[
						'single' => true,
						'type' => 'string',
						'show_in_rest' => true,
						'auth_callback' => static function (): bool {
							return current_user_can('edit_posts');
						},
						'sanitize_callback' => static function ($value) use ($field): string {
							return self::sanitize_field_value($value, $field);
						},
					]
				);
			}
		}
	}

	public static function add_meta_boxes(): void {
		foreach (self::field_config() as $post_type => $_fields) {
			add_meta_box(
				'n96_headless_fields',
				'Ninety Six CMS Fields',
				[__CLASS__, 'render_meta_box'],
				$post_type,
				'normal',
				'high'
			);

			add_meta_box(
				'n96_publishing_help',
				'Publishing checklist',
				[__CLASS__, 'render_help_box'],
				$post_type,
				'side',
				'high'
			);
		}
	}

	public static function render_meta_box(WP_Post $post): void {
		$fields = self::field_config()[$post->post_type] ?? [];

		wp_nonce_field('n96_save_meta', 'n96_meta_nonce');

		echo '<table class="form-table" role="presentation"><tbody>';

		foreach ($fields as $key => $field) {
			$value = get_post_meta($post->ID, $key, true);
			$field_id = esc_attr($key);

			echo '<tr>';
			echo '<th scope="row"><label for="' . $field_id . '">' . esc_html($field['label']) . '</label></th>';
			echo '<td>';
			self::render_field_control($key, $field, is_string($value) ? $value : '');

			if (!empty($field['help'])) {
				echo '<p class="description">' . esc_html($field['help']) . '</p>';
			}

			echo '</td>';
			echo '</tr>';
		}

		echo '</tbody></table>';
	}

	public static function render_help_box(WP_Post $post): void {
		$config = self::post_editor_config($post->post_type);

		echo '<p>' . esc_html($config['description'] ?? 'Fill out the fields below, then publish or update this record.') . '</p>';

		if (!empty($config['checklist'])) {
			echo '<ol>';
			foreach ($config['checklist'] as $item) {
				echo '<li>' . esc_html($item) . '</li>';
			}
			echo '</ol>';
		}
	}

	public static function save_meta(int $post_id, WP_Post $post): void {
		$config = self::field_config();

		if (!isset($config[$post->post_type])) {
			return;
		}

		if (!isset($_POST['n96_meta_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['n96_meta_nonce'])), 'n96_save_meta')) {
			return;
		}

		if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
			return;
		}

		if (!current_user_can('edit_post', $post_id)) {
			return;
		}

		foreach ($config[$post->post_type] as $key => $field) {
			if ($field['type'] === 'checkbox') {
				$value = isset($_POST[$key]) ? '1' : '';
				update_post_meta($post_id, $key, $value);
				continue;
			}

			if (!isset($_POST[$key])) {
				continue;
			}

			$value = self::sanitize_field_value(wp_unslash($_POST[$key]), $field);
			update_post_meta($post_id, $key, $value);
		}
	}

	public static function register_rest_routes(): void {
		register_rest_route(
			self::REST_NAMESPACE,
			'/snapshot',
			[
				'methods' => WP_REST_Server::READABLE,
				'permission_callback' => '__return_true',
				'callback' => [__CLASS__, 'rest_snapshot'],
			]
		);
	}

	public static function rest_snapshot(): WP_REST_Response {
		$document_bundle = self::document_bundle();
		$document_index = $document_bundle['index'];

		$response = rest_ensure_response(
			[
				'pages' => self::page_records(),
				'services' => self::service_records($document_index),
				'alerts' => self::alert_records(),
				'news' => self::news_records(),
				'events' => self::event_records(),
				'meetings' => self::meeting_records($document_index),
				'departments' => self::department_records(),
				'officials' => self::official_records(),
				'staff' => self::staff_records(),
				'documents' => $document_bundle['records'],
				'externalLinks' => self::external_link_records(),
			]
		);

		$response->header('Cache-Control', 'public, max-age=300');

		return $response;
	}

	public static function title_placeholder(string $title, WP_Post $post): string {
		$config = self::post_editor_config($post->post_type);
		return $config['title_placeholder'] ?? $title;
	}

	private static function post_type_config(): array {
		return [
			self::POST_SERVICE => [
				'singular' => 'Service',
				'plural' => 'Services',
				'icon' => 'dashicons-admin-tools',
				'position' => 20,
			],
			self::POST_ALERT => [
				'singular' => 'Alert',
				'plural' => 'Alerts',
				'icon' => 'dashicons-warning',
				'position' => 21,
				'supports' => ['title', 'revisions', 'page-attributes'],
			],
			self::POST_EVENT => [
				'singular' => 'Event',
				'plural' => 'Events',
				'icon' => 'dashicons-calendar-alt',
				'position' => 22,
				'template' => [
					['core/paragraph', ['placeholder' => 'Add public event details, parking notes, schedule details, or accessibility notes.']],
				],
			],
			self::POST_MEETING => [
				'singular' => 'Meeting',
				'plural' => 'Meetings',
				'icon' => 'dashicons-groups',
				'position' => 23,
			],
			self::POST_DEPARTMENT => [
				'singular' => 'Department',
				'plural' => 'Departments',
				'icon' => 'dashicons-building',
				'position' => 24,
			],
			self::POST_OFFICIAL => [
				'singular' => 'Official',
				'plural' => 'Officials',
				'icon' => 'dashicons-id',
				'position' => 25,
			],
			self::POST_STAFF => [
				'singular' => 'Staff Member',
				'plural' => 'Staff',
				'icon' => 'dashicons-businessperson',
				'position' => 26,
				'supports' => ['title', 'revisions', 'page-attributes'],
			],
			self::POST_DOCUMENT => [
				'singular' => 'Document',
				'plural' => 'Documents',
				'icon' => 'dashicons-media-document',
				'position' => 27,
			],
			self::POST_EXTERNAL_LINK => [
				'singular' => 'External Link',
				'plural' => 'External Links',
				'icon' => 'dashicons-admin-links',
				'position' => 28,
			],
		];
	}

	private static function post_editor_config(string $post_type): array {
		$config = [
			'page' => [
				'title_placeholder' => 'Page title',
				'description' => 'Use Pages for resident-facing page copy that appears in the public website snapshot.',
				'checklist' => [
					'Write the page title and public summary.',
					'Check Include in headless snapshot when the public site should use this page.',
					'Publish or update the page.',
				],
			],
			'post' => [
				'title_placeholder' => 'News headline',
				'description' => 'Use Posts for town news. Every published post gets a public news page on the website.',
				'checklist' => [
					'Write the headline, excerpt, and post body.',
					'Add a related URL only when the post should link to an outside source.',
					'Publish the post.',
				],
			],
			self::POST_SERVICE => [
				'title_placeholder' => 'Service name, such as Trash Collection',
				'description' => 'Services power Common Services, the Services page, and individual service detail pages.',
				'checklist' => [
					'Add the public summary, audience, steps, and contact.',
					'Check Featured on homepage for Common Services.',
					'Publish the service.',
				],
			],
			self::POST_ALERT => [
				'title_placeholder' => 'Alert title, such as Trash Pickup Delay',
				'description' => 'Alerts power the homepage alert area and site search.',
				'checklist' => [
					'Enter a short alert title.',
					'Fill in Alert message and Severity.',
					'Check Active when the alert should show on the website.',
					'Publish or update the alert.',
				],
			],
			self::POST_EVENT => [
				'title_placeholder' => 'Event name, such as Regular Town Council Meeting',
				'description' => 'Events power the Events page, event detail pages, homepage calendar, search, sitemap, and structured data.',
				'checklist' => [
					'Add the event date, time, location, summary, and body details.',
					'Add map address, coordinates, and Apple Place ID when an Apple Maps embed should display.',
					'Publish the event.',
				],
			],
			self::POST_MEETING => [
				'title_placeholder' => 'Meeting name, such as Regular Town Council Meeting',
				'description' => 'Meetings power the public meetings page and can link to agenda, minutes, or recording documents.',
				'checklist' => [
					'Add the meeting date, time, and location.',
					'Add related document IDs or slugs after creating Documents.',
					'Publish the meeting.',
				],
			],
			self::POST_DEPARTMENT => [
				'title_placeholder' => 'Department name, such as Town Hall',
				'description' => 'Departments power the department directory and contact pages.',
				'checklist' => [
					'Add the summary, contact details, and service areas.',
					'Keep phone options in the contact fields.',
					'Publish the department.',
				],
			],
			self::POST_OFFICIAL => [
				'title_placeholder' => 'Mayor or council member name',
				'description' => 'Officials power the Mayor and Town Council page.',
				'checklist' => [
					'Add the role, ward, email, and committees.',
					'Use Mayor for the mayor record.',
					'Publish the official.',
				],
			],
			self::POST_STAFF => [
				'title_placeholder' => 'Staff member or office name',
				'description' => 'Staff records power the public staff directory on the Contact page.',
				'checklist' => [
					'Add the role, department, phone, and email.',
					'Use office names when a person name should not be public.',
					'Publish the staff record.',
				],
			],
			self::POST_DOCUMENT => [
				'title_placeholder' => 'Document title, such as July Agenda',
				'description' => 'Documents can be attached to Services and Meetings by stable ID, slug, or post ID.',
				'checklist' => [
					'Add the document URL and kind.',
					'Add a document date when useful.',
					'Publish the document.',
				],
			],
			self::POST_EXTERNAL_LINK => [
				'title_placeholder' => 'External link title',
				'description' => 'External Links power official portal and resource links in the public website snapshot.',
				'checklist' => [
					'Add the external URL, description, and link type.',
					'Use stable IDs for links that replace seed content.',
					'Publish the link.',
				],
			],
		];

		return $config[$post_type] ?? [];
	}

	private static function field_config(): array {
		$record_id = [
			'n96_record_id' => [
				'label' => 'Stable record ID',
				'type' => 'text',
				'help' => 'Optional. Use seed-compatible IDs such as service-trash or link-business when replacing local seed data.',
			],
		];
		$summary = [
			'n96_summary' => [
				'label' => 'Summary',
				'type' => 'textarea',
				'help' => 'Short public summary. Falls back to the excerpt or editor content when empty.',
			],
		];
		$contact = [
			'n96_contact_label' => [
				'label' => 'Contact label',
				'type' => 'text',
			],
			'n96_contact_phone' => [
				'label' => 'Contact phone',
				'type' => 'text',
			],
			'n96_contact_email' => [
				'label' => 'Contact email',
				'type' => 'email',
			],
			'n96_contact_address' => [
				'label' => 'Contact address',
				'type' => 'text',
			],
			'n96_contact_hours' => [
				'label' => 'Contact hours',
				'type' => 'text',
			],
		];
		$document_refs = [
			'n96_document_refs' => [
				'label' => 'Related document IDs or slugs',
				'type' => 'textarea',
				'help' => 'One document stable ID, WordPress slug, or post ID per line.',
			],
		];

		return [
			'page' => array_merge(
				$record_id,
				[
					'n96_include_in_snapshot' => [
						'label' => 'Include in headless snapshot',
						'type' => 'checkbox',
					],
					'n96_cms_status' => [
						'label' => 'CMS status',
						'type' => 'select',
						'options' => [
							'published' => 'Published',
							'draft' => 'Draft',
							'archived' => 'Archived',
						],
					],
					'n96_summary' => [
						'label' => 'Page summary',
						'type' => 'textarea',
					],
					'n96_body' => [
						'label' => 'Body paragraphs',
						'type' => 'textarea',
						'help' => 'Optional. One paragraph per line. Falls back to the page editor content when empty.',
					],
				]
			),
			'post' => array_merge(
				$record_id,
				$summary,
				[
					'n96_news_href' => [
						'label' => 'Related URL',
						'type' => 'url',
						'help' => 'Optional. Add an official source, form, portal, or outside page related to this news post.',
					],
				]
			),
			self::POST_SERVICE => array_merge(
				$record_id,
				$summary,
				[
					'n96_audience' => [
						'label' => 'Audience',
						'type' => 'text',
					],
					'n96_steps' => [
						'label' => 'Steps',
						'type' => 'textarea',
						'help' => 'One step per line.',
					],
					'n96_fees_deadlines' => [
						'label' => 'Fees and deadlines',
						'type' => 'textarea',
						'help' => 'One fee, deadline, or note per line.',
					],
				],
				$contact,
				$document_refs,
				[
					'n96_action_label' => [
						'label' => 'Action label',
						'type' => 'text',
					],
					'n96_action_href' => [
						'label' => 'Action URL',
						'type' => 'url',
					],
					'n96_action_external' => [
						'label' => 'Action opens external site',
						'type' => 'checkbox',
					],
					'n96_icon' => [
						'label' => 'Icon name',
						'type' => 'text',
						'help' => 'Use an existing frontend icon name such as trash, credit-card, briefcase, droplets, landmark, or bell.',
					],
					'n96_featured' => [
						'label' => 'Featured on homepage',
						'type' => 'checkbox',
					],
				]
			),
			self::POST_ALERT => array_merge(
				$record_id,
				[
					'n96_alert_message' => [
						'label' => 'Alert message',
						'type' => 'textarea',
					],
					'n96_alert_severity' => [
						'label' => 'Severity',
						'type' => 'select',
						'options' => [
							'notice' => 'Notice',
							'warning' => 'Warning',
							'urgent' => 'Urgent',
						],
					],
					'n96_alert_active' => [
						'label' => 'Active',
						'type' => 'checkbox',
					],
					'n96_alert_href' => [
						'label' => 'Alert URL',
						'type' => 'url',
					],
					'n96_alert_icon_svg' => [
						'label' => 'Custom icon SVG',
						'type' => 'svg',
						'help' => 'Optional. Paste a complete inline SVG, such as <svg viewBox="0 0 24 24">...</svg>. The website uses the bell icon when this is blank.',
					],
				]
			),
			self::POST_EVENT => array_merge(
				$record_id,
				$summary,
				[
					'n96_event_date' => [
						'label' => 'Event date',
						'type' => 'date',
					],
					'n96_event_time' => [
						'label' => 'Event time',
						'type' => 'text',
					],
					'n96_event_location' => [
						'label' => 'Event location',
						'type' => 'text',
					],
					'n96_event_address' => [
						'label' => 'Map address',
						'type' => 'text',
						'help' => 'Street address used for the event page map. Example: 97 Main Street E, Ninety Six, SC 29666.',
					],
					'n96_event_latitude' => [
						'label' => 'Map latitude',
						'type' => 'text',
						'help' => 'Optional. Required with longitude to show the Apple Maps embed.',
					],
					'n96_event_longitude' => [
						'label' => 'Map longitude',
						'type' => 'text',
						'help' => 'Optional. Required with latitude to show the Apple Maps embed.',
					],
					'n96_event_apple_place_id' => [
						'label' => 'Apple Maps Place ID',
						'type' => 'text',
						'help' => 'Optional but recommended. Use Apple Place ID Lookup, then paste the Place ID here for the Apple Maps Embed API.',
					],
					'n96_event_href' => [
						'label' => 'Related event URL',
						'type' => 'url',
						'help' => 'Optional. The website will still create an event page; this can point to a related outside schedule or registration page.',
					],
				]
			),
			self::POST_MEETING => array_merge(
				$record_id,
				[
					'n96_meeting_date' => [
						'label' => 'Meeting date',
						'type' => 'date',
					],
					'n96_meeting_time' => [
						'label' => 'Meeting time',
						'type' => 'text',
					],
					'n96_meeting_location' => [
						'label' => 'Meeting location',
						'type' => 'text',
					],
				],
				$document_refs
			),
			self::POST_DEPARTMENT => array_merge(
				$record_id,
				$summary,
				$contact,
				[
					'n96_department_services' => [
						'label' => 'Department services',
						'type' => 'textarea',
						'help' => 'One service area per line.',
					],
				]
			),
			self::POST_OFFICIAL => array_merge(
				$record_id,
				[
					'n96_official_role' => [
						'label' => 'Role',
						'type' => 'text',
					],
					'n96_official_ward' => [
						'label' => 'Ward',
						'type' => 'text',
					],
					'n96_official_email' => [
						'label' => 'Email',
						'type' => 'email',
					],
					'n96_official_committees' => [
						'label' => 'Committees',
						'type' => 'textarea',
						'help' => 'One committee per line.',
					],
				]
			),
			self::POST_STAFF => array_merge(
				$record_id,
				[
					'n96_staff_role' => [
						'label' => 'Role',
						'type' => 'text',
					],
					'n96_staff_department' => [
						'label' => 'Department',
						'type' => 'text',
					],
					'n96_staff_phone' => [
						'label' => 'Phone',
						'type' => 'text',
					],
					'n96_staff_email' => [
						'label' => 'Email',
						'type' => 'email',
					],
				]
			),
			self::POST_DOCUMENT => array_merge(
				$record_id,
				[
					'n96_document_href' => [
						'label' => 'Document URL',
						'type' => 'url',
					],
					'n96_document_kind' => [
						'label' => 'Document kind',
						'type' => 'select',
						'options' => [
							'agenda' => 'Agenda',
							'minutes' => 'Minutes',
							'recording' => 'Recording',
							'form' => 'Form',
							'map' => 'Map',
							'ordinance' => 'Ordinance',
							'archive' => 'Archive',
						],
					],
					'n96_document_date' => [
						'label' => 'Document date',
						'type' => 'date',
					],
				]
			),
			self::POST_EXTERNAL_LINK => array_merge(
				$record_id,
				[
					'n96_link_href' => [
						'label' => 'External URL',
						'type' => 'url',
					],
					'n96_link_description' => [
						'label' => 'Description',
						'type' => 'textarea',
					],
					'n96_link_type' => [
						'label' => 'Link type',
						'type' => 'select',
						'options' => [
							'payment' => 'Payment',
							'ordinance' => 'Ordinance',
							'archive' => 'Archive',
							'state' => 'State',
							'form' => 'Form',
							'resource' => 'Resource',
						],
					],
				]
			),
		];
	}

	private static function render_field_control(string $key, array $field, string $value): void {
		$field_id = esc_attr($key);
		$field_name = esc_attr($key);
		$type = $field['type'];

		if ($type === 'svg') {
			echo '<textarea class="large-text code" rows="8" id="' . $field_id . '" name="' . $field_name . '" spellcheck="false">' . esc_textarea($value) . '</textarea>';
			return;
		}

		if ($type === 'textarea') {
			echo '<textarea class="large-text" rows="4" id="' . $field_id . '" name="' . $field_name . '">' . esc_textarea($value) . '</textarea>';
			return;
		}

		if ($type === 'checkbox') {
			echo '<label><input type="checkbox" id="' . $field_id . '" name="' . $field_name . '" value="1" ' . checked($value, '1', false) . ' /> Yes</label>';
			return;
		}

		if ($type === 'select') {
			echo '<select id="' . $field_id . '" name="' . $field_name . '">';
			foreach (($field['options'] ?? []) as $option_value => $label) {
				echo '<option value="' . esc_attr($option_value) . '" ' . selected($value, $option_value, false) . '>' . esc_html($label) . '</option>';
			}
			echo '</select>';
			return;
		}

		$input_type = in_array($type, ['url', 'email', 'date'], true) ? $type : 'text';
		echo '<input class="regular-text" type="' . esc_attr($input_type) . '" id="' . $field_id . '" name="' . $field_name . '" value="' . esc_attr($value) . '" />';
	}

	private static function sanitize_field_value($value, array $field): string {
		if (is_array($value)) {
			$value = implode("\n", array_map('sanitize_text_field', $value));
		}

		$value = trim((string) $value);
		$type = $field['type'];

		if ($type === 'checkbox') {
			return $value === '' ? '' : '1';
		}

		if ($type === 'url') {
			return esc_url_raw($value);
		}

		if ($type === 'email') {
			return sanitize_email($value);
		}

		if ($type === 'date') {
			return preg_match('/^\d{4}-\d{2}-\d{2}$/', $value) ? $value : '';
		}

		if ($type === 'svg') {
			return self::sanitize_svg($value);
		}

		if ($type === 'select') {
			$options = array_keys($field['options'] ?? []);
			return in_array($value, $options, true) ? $value : ($options[0] ?? '');
		}

		if ($type === 'textarea') {
			return sanitize_textarea_field($value);
		}

		return sanitize_text_field($value);
	}

	private static function sanitize_svg(string $value): string {
		if ($value === '' || stripos($value, '<svg') === false || stripos($value, '</svg>') === false) {
			return '';
		}

		$allowed_svg = [
			'svg' => [
				'aria-hidden' => true,
				'class' => true,
				'fill' => true,
				'focusable' => true,
				'height' => true,
				'role' => true,
				'stroke' => true,
				'stroke-linecap' => true,
				'stroke-linejoin' => true,
				'stroke-width' => true,
				'viewBox' => true,
				'viewbox' => true,
				'width' => true,
				'xmlns' => true,
			],
			'g' => [
				'class' => true,
				'fill' => true,
				'stroke' => true,
				'stroke-linecap' => true,
				'stroke-linejoin' => true,
				'stroke-width' => true,
				'transform' => true,
			],
			'path' => [
				'class' => true,
				'clip-rule' => true,
				'd' => true,
				'fill' => true,
				'fill-rule' => true,
				'stroke' => true,
				'stroke-linecap' => true,
				'stroke-linejoin' => true,
				'stroke-width' => true,
				'transform' => true,
			],
			'circle' => [
				'class' => true,
				'cx' => true,
				'cy' => true,
				'fill' => true,
				'r' => true,
				'stroke' => true,
				'stroke-width' => true,
			],
			'ellipse' => [
				'class' => true,
				'cx' => true,
				'cy' => true,
				'fill' => true,
				'rx' => true,
				'ry' => true,
				'stroke' => true,
				'stroke-width' => true,
			],
			'line' => [
				'class' => true,
				'fill' => true,
				'stroke' => true,
				'stroke-linecap' => true,
				'stroke-width' => true,
				'x1' => true,
				'x2' => true,
				'y1' => true,
				'y2' => true,
			],
			'polygon' => [
				'class' => true,
				'fill' => true,
				'points' => true,
				'stroke' => true,
				'stroke-linejoin' => true,
				'stroke-width' => true,
			],
			'polyline' => [
				'class' => true,
				'fill' => true,
				'points' => true,
				'stroke' => true,
				'stroke-linecap' => true,
				'stroke-linejoin' => true,
				'stroke-width' => true,
			],
			'rect' => [
				'class' => true,
				'fill' => true,
				'height' => true,
				'rx' => true,
				'ry' => true,
				'stroke' => true,
				'stroke-width' => true,
				'width' => true,
				'x' => true,
				'y' => true,
			],
			'title' => [],
		];

		return trim(wp_kses($value, $allowed_svg));
	}

	private static function page_records(): array {
		$posts = get_posts(
			[
				'post_type' => 'page',
				'post_status' => 'publish',
				'numberposts' => -1,
				'meta_key' => 'n96_include_in_snapshot',
				'meta_value' => '1',
				'orderby' => 'menu_order title',
				'order' => 'ASC',
			]
		);

		return array_values(array_map([__CLASS__, 'map_page'], $posts));
	}

	private static function service_records(array $document_index): array {
		return array_values(
			array_map(
				static function (WP_Post $post) use ($document_index): array {
					$slug = self::slug($post);
					$action_href = self::meta($post, 'n96_action_href');

					return [
						'id' => self::record_id($post, 'service'),
						'slug' => $slug,
						'title' => self::title($post),
						'summary' => self::summary($post),
						'audience' => self::meta($post, 'n96_audience'),
						'steps' => self::lines($post, 'n96_steps'),
						'feesAndDeadlines' => self::lines($post, 'n96_fees_deadlines'),
						'contact' => self::contact($post),
						'documents' => self::related_documents($post, $document_index),
						'action' => self::without_empty(
							[
								'label' => self::meta($post, 'n96_action_label', 'View Details'),
								'href' => $action_href !== '' ? $action_href : '/services/' . $slug,
								'external' => self::bool_meta($post, 'n96_action_external'),
							]
						),
						'icon' => self::meta($post, 'n96_icon', 'file'),
						'featured' => self::bool_meta($post, 'n96_featured'),
					];
				},
				self::query_records(self::POST_SERVICE)
			)
		);
	}

	private static function alert_records(): array {
		return array_values(
			array_map(
				static function (WP_Post $post): array {
					$href = self::meta($post, 'n96_alert_href');
					$icon_svg = self::meta($post, 'n96_alert_icon_svg');
					$record = [
						'id' => self::record_id($post, 'alert'),
						'title' => self::title($post),
						'message' => self::meta($post, 'n96_alert_message', self::summary($post)),
						'severity' => self::meta($post, 'n96_alert_severity', 'notice'),
						'active' => self::bool_meta($post, 'n96_alert_active'),
						'updatedAt' => self::modified_date($post),
					];

					if ($href !== '') {
						$record['href'] = $href;
					}

					if ($icon_svg !== '') {
						$record['iconSvg'] = $icon_svg;
					}

					return $record;
				},
				self::query_records(self::POST_ALERT)
			)
		);
	}

	private static function news_records(): array {
		return array_values(
			array_map(
				static function (WP_Post $post): array {
					$href = self::meta($post, 'n96_news_href');
					$record = [
						'id' => self::record_id($post, 'news'),
						'slug' => self::slug($post),
						'title' => self::title($post),
						'summary' => self::summary($post),
						'body' => self::body($post),
						'date' => get_post_time('Y-m-d', false, $post),
						'updatedAt' => self::modified_date($post),
					];

					if ($href !== '') {
						$record['href'] = $href;
					}

					return $record;
				},
				self::query_records('post', '', 'DESC')
			)
		);
	}

	private static function event_records(): array {
		return array_values(
			array_map(
				static function (WP_Post $post): array {
					$href = self::meta($post, 'n96_event_href');
					$record = [
						'id' => self::record_id($post, 'event'),
						'slug' => self::slug($post),
						'title' => self::title($post),
						'date' => self::date_meta($post, 'n96_event_date'),
						'time' => self::meta($post, 'n96_event_time', 'To be announced'),
						'location' => self::meta($post, 'n96_event_location'),
						'address' => self::meta($post, 'n96_event_address'),
						'latitude' => self::meta($post, 'n96_event_latitude'),
						'longitude' => self::meta($post, 'n96_event_longitude'),
						'applePlaceId' => self::meta($post, 'n96_event_apple_place_id'),
						'summary' => self::summary($post),
						'body' => self::body($post),
					];

					if ($href !== '') {
						$record['href'] = $href;
					}

					return self::without_empty($record);
				},
				self::query_records(self::POST_EVENT, 'n96_event_date', 'ASC')
			)
		);
	}

	private static function meeting_records(array $document_index): array {
		return array_values(
			array_map(
				static function (WP_Post $post) use ($document_index): array {
					return [
						'id' => self::record_id($post, 'meeting'),
						'title' => self::title($post),
						'date' => self::date_meta($post, 'n96_meeting_date'),
						'time' => self::meta($post, 'n96_meeting_time', 'To be announced'),
						'location' => self::meta($post, 'n96_meeting_location'),
						'documents' => self::related_documents($post, $document_index),
					];
				},
				self::query_records(self::POST_MEETING, 'n96_meeting_date', 'DESC')
			)
		);
	}

	private static function department_records(): array {
		return array_values(
			array_map(
				static function (WP_Post $post): array {
					return [
						'id' => self::record_id($post, 'dept'),
						'slug' => self::slug($post),
						'name' => self::title($post),
						'summary' => self::summary($post),
						'contact' => self::contact($post),
						'services' => self::lines($post, 'n96_department_services'),
					];
				},
				self::query_records(self::POST_DEPARTMENT)
			)
		);
	}

	private static function official_records(): array {
		return array_values(
			array_map(
				static function (WP_Post $post): array {
					return self::without_empty(
						[
							'id' => self::record_id($post, 'official'),
							'name' => self::title($post),
							'role' => self::meta($post, 'n96_official_role'),
							'ward' => self::meta($post, 'n96_official_ward'),
							'email' => self::meta($post, 'n96_official_email'),
							'committees' => self::lines($post, 'n96_official_committees'),
						]
					);
				},
				self::query_records(self::POST_OFFICIAL)
			)
		);
	}

	private static function staff_records(): array {
		return array_values(
			array_map(
				static function (WP_Post $post): array {
					return self::without_empty(
						[
							'id' => self::record_id($post, 'staff'),
							'name' => self::title($post),
							'role' => self::meta($post, 'n96_staff_role'),
							'department' => self::meta($post, 'n96_staff_department'),
							'phone' => self::meta($post, 'n96_staff_phone'),
							'email' => self::meta($post, 'n96_staff_email'),
						]
					);
				},
				self::query_records(self::POST_STAFF)
			)
		);
	}

	private static function document_bundle(): array {
		$records = [];
		$index = [];

		foreach (self::query_records(self::POST_DOCUMENT) as $post) {
			$record = self::map_document($post);
			$records[] = $record;

			foreach (self::lookup_keys($post, $record['id']) as $key) {
				$index[$key] = $record;
			}
		}

		return [
			'records' => $records,
			'index' => $index,
		];
	}

	private static function external_link_records(): array {
		return array_values(
			array_map(
				static function (WP_Post $post): array {
					return [
						'id' => self::record_id($post, 'link'),
						'title' => self::title($post),
						'href' => self::meta($post, 'n96_link_href'),
						'description' => self::meta($post, 'n96_link_description', self::summary($post)),
						'type' => self::meta($post, 'n96_link_type', 'resource'),
					];
				},
				self::query_records(self::POST_EXTERNAL_LINK)
			)
		);
	}

	private static function query_records(string $post_type, string $date_key = '', string $order = 'ASC'): array {
		$args = [
			'post_type' => $post_type,
			'post_status' => 'publish',
			'numberposts' => -1,
			'orderby' => 'menu_order title',
			'order' => $order,
		];

		if ($post_type === 'post') {
			$args['orderby'] = 'date';
		}

		if ($date_key !== '') {
			$args['meta_key'] = $date_key;
			$args['orderby'] = 'meta_value';
			$args['meta_type'] = 'DATE';
			$args['order'] = $order;
		}

		return get_posts($args);
	}

	private static function map_page(WP_Post $post): array {
		$status = self::meta($post, 'n96_cms_status', 'published');

		if (!in_array($status, ['published', 'draft', 'archived'], true)) {
			$status = 'published';
		}

		return [
			'id' => self::record_id($post, 'page'),
			'slug' => self::slug($post),
			'title' => self::title($post),
			'summary' => self::summary($post),
			'body' => self::body($post),
			'status' => $status,
			'updatedAt' => self::modified_date($post),
		];
	}

	private static function map_document(WP_Post $post): array {
		$record = [
			'id' => self::record_id($post, 'doc'),
			'title' => self::title($post),
			'href' => self::meta($post, 'n96_document_href'),
			'kind' => self::meta($post, 'n96_document_kind', 'archive'),
		];
		$date = self::meta($post, 'n96_document_date');

		if ($date !== '') {
			$record['date'] = $date;
		}

		return $record;
	}

	private static function related_documents(WP_Post $post, array $document_index): array {
		$records = [];
		$seen = [];

		foreach (self::lines($post, 'n96_document_refs') as $ref) {
			$key = sanitize_title($ref);
			$document = $document_index[$ref] ?? $document_index[$key] ?? null;

			if (!$document || isset($seen[$document['id']])) {
				continue;
			}

			$seen[$document['id']] = true;
			$records[] = $document;
		}

		return $records;
	}

	private static function lookup_keys(WP_Post $post, string $record_id): array {
		return array_values(
			array_filter(
				array_unique(
					[
						$record_id,
						sanitize_title($record_id),
						$post->post_name,
						(string) $post->ID,
						sanitize_title(self::title($post)),
					]
				)
			)
		);
	}

	private static function record_id(WP_Post $post, string $prefix): string {
		$custom_id = self::meta($post, 'n96_record_id');

		if ($custom_id !== '') {
			return sanitize_title($custom_id);
		}

		return $prefix . '-' . self::slug($post);
	}

	private static function contact(WP_Post $post): array {
		return self::without_empty(
			[
				'label' => self::meta($post, 'n96_contact_label', 'Town Hall'),
				'phone' => self::meta($post, 'n96_contact_phone'),
				'email' => self::meta($post, 'n96_contact_email'),
				'address' => self::meta($post, 'n96_contact_address'),
				'hours' => self::meta($post, 'n96_contact_hours'),
			]
		);
	}

	private static function without_empty(array $record): array {
		foreach ($record as $key => $value) {
			if ($value === '' || (is_array($value) && count($value) === 0)) {
				unset($record[$key]);
			}
		}

		return $record;
	}

	private static function slug(WP_Post $post): string {
		return $post->post_name !== '' ? $post->post_name : sanitize_title(self::title($post));
	}

	private static function title(WP_Post $post): string {
		return self::clean_text(get_the_title($post));
	}

	private static function summary(WP_Post $post): string {
		$summary = self::meta($post, 'n96_summary');

		if ($summary !== '') {
			return $summary;
		}

		if ($post->post_excerpt !== '') {
			return self::clean_text($post->post_excerpt);
		}

		return wp_trim_words(self::clean_text($post->post_content), 32, '');
	}

	private static function body(WP_Post $post): array {
		$body = self::lines($post, 'n96_body');

		if (count($body) > 0) {
			return $body;
		}

		$content = preg_replace('/<\/p>|<br\s*\/?>/i', "\n", apply_filters('the_content', $post->post_content));
		return self::split_lines(wp_strip_all_tags((string) $content));
	}

	private static function lines(WP_Post $post, string $key): array {
		return self::split_lines(self::raw_meta($post, $key));
	}

	private static function split_lines(string $value): array {
		$value = str_replace(["\r\n", "\r"], "\n", $value);
		$lines = array_map(
			static function (string $line): string {
				return self::clean_text($line);
			},
			explode("\n", $value)
		);

		return array_values(array_filter($lines, static function (string $line): bool {
			return $line !== '';
		}));
	}

	private static function meta(WP_Post $post, string $key, string $fallback = ''): string {
		$value = self::raw_meta($post, $key);
		return $value !== '' ? self::clean_text($value) : self::clean_text($fallback);
	}

	private static function raw_meta(WP_Post $post, string $key): string {
		$value = get_post_meta($post->ID, $key, true);
		return is_scalar($value) ? trim((string) $value) : '';
	}

	private static function bool_meta(WP_Post $post, string $key): bool {
		return self::raw_meta($post, $key) === '1';
	}

	private static function date_meta(WP_Post $post, string $key): string {
		$value = self::meta($post, $key);
		return $value !== '' ? $value : get_post_time('Y-m-d', false, $post);
	}

	private static function modified_date(WP_Post $post): string {
		return get_post_modified_time('Y-m-d', false, $post);
	}

	private static function clean_text(string $value): string {
		return trim(wp_strip_all_tags(html_entity_decode($value, ENT_QUOTES, get_bloginfo('charset'))));
	}
}

Ninety_Six_Headless_CMS::boot();
