<?php
/**
 * Seed demo content for local WP-CLI testing.
 *
 * Usage:
 * wp --path=/path/to/wordpress eval-file wordpress/ninety-six-headless-cms/bin/seed-demo-content.php
 */

defined('ABSPATH') || exit;

if (!class_exists('WP_CLI')) {
	return;
}

$required_post_types = [
	'n96_service',
	'n96_alert',
	'n96_event',
	'n96_meeting',
	'n96_department',
	'n96_official',
	'n96_staff',
	'n96_document',
	'n96_external_link',
];

foreach ($required_post_types as $post_type) {
	if (!post_type_exists($post_type)) {
		WP_CLI::error('Activate the Town of Ninety Six Headless CMS plugin before running this seed script.');
	}
}

function n96_cli_post_by_record_id(string $post_type, string $record_id): int {
	$posts = get_posts(
		[
			'post_type' => $post_type,
			'post_status' => 'any',
			'numberposts' => 1,
			'fields' => 'ids',
			'meta_key' => 'n96_record_id',
			'meta_value' => $record_id,
		]
	);

	return isset($posts[0]) ? (int) $posts[0] : 0;
}

function n96_cli_upsert_post(array $post, array $meta): int {
	$post_type = $post['post_type'];
	$record_id = $meta['n96_record_id'] ?? '';
	$post_id = $record_id !== '' ? n96_cli_post_by_record_id($post_type, $record_id) : 0;

	$post_data = array_merge(
		[
			'post_status' => 'publish',
			'post_content' => '',
			'post_excerpt' => '',
		],
		$post
	);

	if ($post_id > 0) {
		$post_data['ID'] = $post_id;
		$result = wp_update_post($post_data, true);
	} else {
		$result = wp_insert_post($post_data, true);
	}

	if (is_wp_error($result)) {
		WP_CLI::error($result->get_error_message());
	}

	$post_id = (int) $result;

	foreach ($meta as $key => $value) {
		update_post_meta($post_id, $key, $value);
	}

	return $post_id;
}

n96_cli_upsert_post(
	[
		'post_type' => 'page',
		'post_title' => 'Residents',
		'post_name' => 'residents',
		'post_content' => 'Ninety Six residents should be able to handle common town needs quickly.',
		'post_excerpt' => 'Fast access to everyday town services, local information, and ways to stay connected.',
	],
	[
		'n96_record_id' => 'page-residents',
		'n96_include_in_snapshot' => '1',
		'n96_cms_status' => 'published',
		'n96_summary' => 'Fast access to everyday town services, local information, and ways to stay connected.',
		'n96_body' => "Ninety Six residents should be able to handle common town needs quickly.\nThis page is seeded from WP-CLI for local testing.",
	]
);

n96_cli_upsert_post(
	[
		'post_type' => 'n96_document',
		'post_title' => 'Legacy meeting records',
		'post_name' => 'legacy-records',
	],
	[
		'n96_record_id' => 'legacy-records',
		'n96_document_href' => 'https://townofninetysix.sc.gov/minutes-agendas-and-recordings',
		'n96_document_kind' => 'archive',
	]
);

n96_cli_upsert_post(
	[
		'post_type' => 'n96_external_link',
		'post_title' => 'Renew Business License',
		'post_name' => 'renew-business-license',
	],
	[
		'n96_record_id' => 'link-business',
		'n96_link_href' => 'https://sc-ninety-six-portal.govpossible.com/',
		'n96_link_description' => 'GovPossible renewal portal for Town of Ninety Six business licenses.',
		'n96_link_type' => 'payment',
	]
);

n96_cli_upsert_post(
	[
		'post_type' => 'n96_external_link',
		'post_title' => 'Code of Ordinances',
		'post_name' => 'code-of-ordinances',
	],
	[
		'n96_record_id' => 'link-ordinances',
		'n96_link_href' => 'https://library.municode.com/sc/ninety_six/codes/code_of_ordinances',
		'n96_link_description' => 'Municode ordinance library for the Town of Ninety Six.',
		'n96_link_type' => 'ordinance',
	]
);

n96_cli_upsert_post(
	[
		'post_type' => 'n96_service',
		'post_title' => 'Trash Collection',
		'post_name' => 'trash-collection',
		'post_excerpt' => 'Trash pickup is on Thursdays by Local Waste of Upstate.',
	],
	[
		'n96_record_id' => 'service-trash',
		'n96_summary' => 'Trash pickup is on Thursdays by Local Waste of Upstate.',
		'n96_audience' => 'Households and businesses inside the town service area.',
		'n96_steps' => "Place household trash out before pickup on Thursday.\nKeep carts clear of vehicles, mailboxes, and other obstructions.\nReport missed pickup or service issues directly to Local Waste of Upstate.",
		'n96_fees_deadlines' => "Pickup day: Thursday\nService issues: call 864-323-1277",
		'n96_contact_label' => 'Local Waste of Upstate',
		'n96_contact_phone' => '864-323-1277',
		'n96_action_label' => 'View Trash Details',
		'n96_action_href' => '/services/trash-collection',
		'n96_icon' => 'trash',
		'n96_featured' => '1',
	]
);

n96_cli_upsert_post(
	[
		'post_type' => 'n96_service',
		'post_title' => 'Business License Renewal',
		'post_name' => 'business-license-renewal',
		'post_excerpt' => 'Renew an existing Town of Ninety Six business license online through GovPossible.',
	],
	[
		'n96_record_id' => 'service-license',
		'n96_summary' => 'Renew an existing Town of Ninety Six business license online through GovPossible.',
		'n96_audience' => 'Businesses operating inside the Town of Ninety Six.',
		'n96_steps' => "Gather the online access code from your renewal letter.\nOpen the GovPossible renewal portal.\nSubmit renewal information and payment through the portal.",
		'n96_fees_deadlines' => "Business licenses run May 1 through April 30 unless otherwise stated.",
		'n96_contact_label' => 'Business Licensing',
		'n96_contact_phone' => '864-543-2200 option 1',
		'n96_contact_email' => 'businesslic@ninetysixsc.gov',
		'n96_contact_address' => '120 Main Street W, Ninety Six, SC 29666',
		'n96_action_label' => 'Renew Business License',
		'n96_action_href' => 'https://sc-ninety-six-portal.govpossible.com/',
		'n96_action_external' => '1',
		'n96_icon' => 'briefcase',
		'n96_featured' => '1',
	]
);

n96_cli_upsert_post(
	[
		'post_type' => 'post',
		'post_title' => 'Business license renewals are available online',
		'post_name' => 'business-license-renewals',
		'post_content' => 'Business owners can renew existing Town of Ninety Six business licenses through the official GovPossible portal.',
		'post_excerpt' => 'Business owners can renew existing Town of Ninety Six business licenses through the official GovPossible portal.',
	],
	[
		'n96_record_id' => 'news-business-license-renewals',
		'n96_summary' => 'Business owners can renew existing Town of Ninety Six business licenses through the official GovPossible portal.',
		'n96_news_href' => 'https://sc-ninety-six-portal.govpossible.com/',
	]
);

n96_cli_upsert_post(
	[
		'post_type' => 'n96_alert',
		'post_title' => 'Business License Renewals',
		'post_name' => 'business-license-renewals',
	],
	[
		'n96_record_id' => 'alert-business-license',
		'n96_alert_message' => 'Business license renewals can be managed through the official GovPossible portal.',
		'n96_alert_severity' => 'warning',
		'n96_alert_active' => '1',
		'n96_alert_href' => '/business',
	]
);

n96_cli_upsert_post(
	[
		'post_type' => 'n96_event',
		'post_title' => 'SC Festival of Stars',
		'post_name' => 'sc-festival-of-stars',
		'post_excerpt' => 'Festival details should be managed as official event content in WordPress.',
	],
	[
		'n96_record_id' => 'event-festival',
		'n96_summary' => 'Festival details should be managed as official event content in WordPress.',
		'n96_event_date' => '2026-07-04',
		'n96_event_time' => 'Schedule varies',
		'n96_event_location' => 'Ninety Six',
		'n96_event_address' => 'Ninety Six, SC 29666',
		'n96_event_latitude' => '34.17518',
		'n96_event_longitude' => '-82.02395',
		'n96_event_href' => 'https://townofninetysix.sc.gov/sc-festival-stars',
	]
);

n96_cli_upsert_post(
	[
		'post_type' => 'n96_meeting',
		'post_title' => 'Regular Town Council Meeting',
		'post_name' => 'regular-town-council-meeting',
	],
	[
		'n96_record_id' => 'meeting-2026-07',
		'n96_meeting_date' => '2026-07-20',
		'n96_meeting_time' => '6:00 PM',
		'n96_meeting_location' => 'Ninety Six Visitors Center, 97 Main Street E',
		'n96_document_refs' => 'legacy-records',
	]
);

n96_cli_upsert_post(
	[
		'post_type' => 'n96_department',
		'post_title' => 'Town Hall',
		'post_name' => 'town-hall',
		'post_excerpt' => 'General town administration, clerk services, business licensing, depot rental, and mayor contact routing.',
	],
	[
		'n96_record_id' => 'dept-town-hall',
		'n96_summary' => 'General town administration, clerk services, business licensing, depot rental, and mayor contact routing.',
		'n96_contact_label' => 'Town Hall',
		'n96_contact_phone' => '864-543-2200',
		'n96_contact_address' => '120 Main Street W, Ninety Six, SC 29666',
		'n96_department_services' => "Business licensing\nDepot rental\nCouncil requests\nGeneral assistance",
	]
);

n96_cli_upsert_post(
	[
		'post_type' => 'n96_official',
		'post_title' => 'Gregg Brown',
		'post_name' => 'gregg-brown',
	],
	[
		'n96_record_id' => 'official-mayor',
		'n96_official_role' => 'Mayor',
		'n96_official_email' => 'mayor@ninetysixsc.gov',
	]
);

n96_cli_upsert_post(
	[
		'post_type' => 'n96_staff',
		'post_title' => 'Town Clerk',
		'post_name' => 'town-clerk',
	],
	[
		'n96_record_id' => 'staff-town-clerk',
		'n96_staff_role' => 'Town Hall Clerk',
		'n96_staff_department' => 'Town Hall',
		'n96_staff_phone' => '864-543-2200 option 1',
	]
);

WP_CLI::success('Seeded Town of Ninety Six demo CMS content.');
