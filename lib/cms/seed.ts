import type { CmsSnapshot } from "./types";

export const externalLinks = {
  ticketPayment: "https://publicindex.sccourts.org/Greenwood/OnLinePayments/ProcessOnLinePayment.aspx",
  businessLicensePortal: "https://sc-ninety-six-portal.govpossible.com/",
  ordinances: "https://library.municode.com/sc/ninety_six/codes/code_of_ordinances",
  dnrLicensing: "https://www.dnr.sc.gov/licensing.html",
  oldRecords: "https://townofninetysix.sc.gov/minutes-agendas-and-recordings",
  oldSite: "https://townofninetysix.sc.gov/"
};

export const seedContent: CmsSnapshot = {
  pages: [
    {
      id: "page-residents",
      slug: "residents",
      title: "Residents",
      summary: "Fast access to everyday town services, local information, and ways to stay connected.",
      body: [
        "Ninety Six residents should be able to handle common town needs quickly, whether they are checking trash pickup, finding a department, reading council records, or contacting Town Hall.",
        "This section is organized around tasks first, with detailed background available when residents need it."
      ],
      status: "published",
      updatedAt: "2026-06-28"
    },
    {
      id: "page-business",
      slug: "business",
      title: "Business",
      summary: "Resources for opening, renewing, and growing a business in Ninety Six.",
      body: [
        "Business owners can find licensing details, renewal links, local listings, and contacts for Town Hall.",
        "Online renewal remains connected to the official GovPossible portal for v1."
      ],
      status: "published",
      updatedAt: "2026-06-28"
    },
    {
      id: "page-visitors",
      slug: "visitors",
      title: "Visitors",
      summary: "A practical starting point for local history, parks, outdoor activities, and places to visit.",
      body: [
        "Ninety Six has deep history and a strong outdoor identity. Visitor content should invite people in while keeping civic information easy to find.",
        "The Visitor Center is located at 97 E. Main Street."
      ],
      status: "published",
      updatedAt: "2026-06-28"
    }
  ],
  services: [
    {
      id: "service-trash",
      slug: "trash-collection",
      title: "Trash Collection",
      summary: "Trash pickup is on Thursdays by Local Waste of Upstate.",
      audience: "Households and businesses inside the town service area.",
      steps: [
        "Place household trash out before pickup on Thursday.",
        "Keep carts clear of vehicles, mailboxes, and other obstructions.",
        "Report missed pickup or service issues directly to Local Waste of Upstate."
      ],
      feesAndDeadlines: ["Pickup day: Thursday", "Service issues: call 864-323-1277"],
      contact: {
        label: "Local Waste of Upstate",
        phone: "864-323-1277"
      },
      documents: [],
      action: {
        label: "View Trash Details",
        href: "/services/trash-collection"
      },
      icon: "trash",
      featured: true
    },
    {
      id: "service-ticket",
      slug: "pay-ticket",
      title: "Pay a Traffic Ticket",
      summary: "Pay municipal court tickets through the official Greenwood County public index payment system.",
      audience: "Anyone with an eligible Ninety Six municipal court case or ticket number.",
      steps: [
        "Have your case or ticket number ready.",
        "Open the official online payment system.",
        "Follow the payment instructions provided by the court payment portal."
      ],
      feesAndDeadlines: ["You will need your case or ticket number.", "Portal fees and payment rules are set by the external payment system."],
      contact: {
        label: "Municipal Court Clerk",
        phone: "864-543-2200 option 2"
      },
      documents: [],
      action: {
        label: "Pay Ticket Online",
        href: externalLinks.ticketPayment,
        external: true
      },
      icon: "credit-card",
      featured: true
    },
    {
      id: "service-license",
      slug: "business-license-renewal",
      title: "Business License Renewal",
      summary: "Renew an existing Town of Ninety Six business license online through GovPossible.",
      audience: "Businesses operating inside the Town of Ninety Six.",
      steps: [
        "Gather the online access code from your renewal letter.",
        "Open the GovPossible renewal portal.",
        "Submit renewal information and payment through the portal."
      ],
      feesAndDeadlines: [
        "2026-2027 renewals are marked past due on the current official site.",
        "Business licenses run May 1 through April 30 unless otherwise stated."
      ],
      contact: {
        label: "Business Licensing",
        phone: "864-543-2200 option 1",
        email: "businesslic@ninetysixsc.gov",
        address: "120 Main Street W, Ninety Six, SC 29666"
      },
      documents: [
        {
          id: "doc-business-app",
          title: "Business license application and handbook archive",
          href: "https://townofninetysix.sc.gov/business-licenses",
          kind: "archive"
        }
      ],
      action: {
        label: "Renew Business License",
        href: externalLinks.businessLicensePortal,
        external: true
      },
      icon: "briefcase",
      featured: true
    },
    {
      id: "service-cpw",
      slug: "utilities-cpw",
      title: "Utilities and CPW",
      summary: "Contact the Ninety Six Commission of Public Works for electric, water, and wastewater service information.",
      audience: "Utility customers and residents with water, sewer, or electric service questions.",
      steps: [
        "Call the CPW office for account and service questions.",
        "Use the on-call number for after-hours utility issues.",
        "Review the CPW page archive for commissioner and utility system information."
      ],
      feesAndDeadlines: ["Office: 864-543-2900", "On-call cell: 864-980-5703", "Fax: 864-543-4304"],
      contact: {
        label: "Ninety Six CPW",
        phone: "864-543-2900"
      },
      documents: [
        {
          id: "doc-cpw-archive",
          title: "Current CPW page archive",
          href: "https://townofninetysix.sc.gov/utilities-cpw",
          kind: "archive"
        }
      ],
      action: {
        label: "Contact CPW",
        href: "tel:8645432900"
      },
      icon: "droplets",
      featured: true
    },
    {
      id: "service-council-request",
      slug: "appear-before-council",
      title: "Appear Before Council",
      summary: "Request time on a Town Council agenda before the regular meeting deadline.",
      audience: "Residents, organizations, and businesses requesting to present to Town Council.",
      steps: [
        "Prepare your request and topic summary.",
        "Submit the request before noon on the second Wednesday before the regular meeting.",
        "Wait for confirmation from Town Hall before attending to present."
      ],
      feesAndDeadlines: [
        "Deadline: 12:00 noon on the second Wednesday preceding the regular meeting.",
        "Regular meetings are held the third Monday of each month unless changed by notice."
      ],
      contact: {
        label: "Town Clerk",
        phone: "864-543-2200 option 1",
        address: "120 Main Street W, Ninety Six, SC 29666"
      },
      documents: [
        {
          id: "doc-council-form",
          title: "Current council request information",
          href: "https://townofninetysix.sc.gov/town-council",
          kind: "archive"
        }
      ],
      action: {
        label: "Contact Town Clerk",
        href: "/contact"
      },
      icon: "landmark"
    },
    {
      id: "service-codered",
      slug: "emergency-notifications",
      title: "Emergency Notifications",
      summary: "Stay connected to urgent town and public safety notifications.",
      audience: "Residents who want emergency alerts and public safety notifications.",
      steps: [
        "Review the CodeRED notification information.",
        "Keep contact information current with official alert systems.",
        "Watch the website alert banner for closures and urgent notices."
      ],
      feesAndDeadlines: ["No local website account is required for v1."],
      contact: {
        label: "Town Hall",
        phone: "864-543-2200"
      },
      documents: [
        {
          id: "doc-codered",
          title: "CodeRED notification system archive",
          href: "https://townofninetysix.sc.gov/codered-notification-system",
          kind: "archive"
        }
      ],
      action: {
        label: "Contact Public Safety",
        href: "/contact"
      },
      icon: "bell"
    }
  ],
  alerts: [
    {
      id: "alert-trash",
      title: "Trash Pickup",
      message: "Thursday is the regular trash pickup day for town service.",
      severity: "notice",
      active: false,
      href: "/services/trash-collection",
      updatedAt: "2026-06-28"
    },
    {
      id: "alert-business-license",
      title: "Business License Renewals",
      message: "2026-2027 renewals are marked past due on the current official site.",
      severity: "warning",
      active: true,
      href: "/business",
      updatedAt: "2026-06-28"
    }
  ],
  news: [
    {
      id: "news-business-license-renewals",
      slug: "business-license-renewals",
      title: "Business license renewals are available online",
      summary: "Business owners can renew existing Town of Ninety Six business licenses through the official GovPossible portal.",
      body: [
        "Business owners can renew existing Town of Ninety Six business licenses through the official GovPossible portal.",
        "Have the online access code from your renewal letter ready before starting the renewal process."
      ],
      date: "2026-06-28",
      updatedAt: "2026-06-28",
      href: externalLinks.businessLicensePortal
    },
    {
      id: "news-trash-pickup",
      slug: "trash-pickup-thursdays",
      title: "Thursday is regular trash pickup day",
      summary: "Trash pickup remains scheduled for Thursdays for households and businesses inside the town service area.",
      body: [
        "Trash pickup remains scheduled for Thursdays for households and businesses inside the town service area.",
        "Place household trash out before pickup and keep carts clear of vehicles, mailboxes, and other obstructions."
      ],
      date: "2026-06-28",
      updatedAt: "2026-06-28"
    }
  ],
  events: [
    {
      id: "event-council-july",
      slug: "regular-town-council-meeting-july-2026",
      title: "Regular Town Council Meeting",
      date: "2026-07-20",
      time: "6:00 PM",
      location: "Ninety Six Visitors Center, 97 Main Street E",
      address: "97 Main Street E, Ninety Six, SC 29666",
      latitude: "34.17518",
      longitude: "-82.02395",
      summary: "Regular meeting date based on the third-Monday schedule. Staff should verify agenda details before publishing.",
      body: [
        "Regular meeting date based on the third-Monday schedule.",
        "Staff should verify agenda details before publishing."
      ],
      href: "/government/meetings"
    },
    {
      id: "event-festival",
      slug: "sc-festival-of-stars-2026",
      title: "SC Festival of Stars",
      date: "2026-07-04",
      time: "Schedule varies",
      location: "Ninety Six",
      address: "Ninety Six, SC 29666",
      latitude: "34.17518",
      longitude: "-82.02395",
      summary: "Festival details should be managed as official event content in WordPress.",
      body: [
        "Festival details should be managed as official event content in WordPress.",
        "Check official town channels for the latest schedule, road closure, and activity details."
      ],
      href: "https://townofninetysix.sc.gov/sc-festival-stars"
    },
    {
      id: "event-craft",
      slug: "spring-craft-show-2027",
      title: "Spring Craft Show",
      date: "2027-03-20",
      time: "To be announced",
      location: "Ninety Six",
      address: "Ninety Six, SC 29666",
      latitude: "34.17518",
      longitude: "-82.02395",
      summary: "A placeholder event entry for the WordPress event workflow.",
      body: [
        "A placeholder event entry for the WordPress event workflow.",
        "Town staff can replace this content with official event details in WordPress."
      ],
      href: "https://townofninetysix.sc.gov/spring-craft-show"
    }
  ],
  meetings: [
    {
      id: "meeting-2026-07",
      title: "Regular Town Council Meeting",
      date: "2026-07-20",
      time: "6:00 PM",
      location: "Ninety Six Visitors Center, 97 Main Street E",
      documents: [
        {
          id: "meeting-archive",
          title: "Legacy agendas, minutes, and recordings",
          href: externalLinks.oldRecords,
          kind: "archive"
        }
      ]
    },
    {
      id: "meeting-2026-01",
      title: "Regular Town Council Meeting",
      date: "2026-01-26",
      time: "6:00 PM",
      location: "Ninety Six Visitors Center, 97 Main Street E",
      documents: [
        {
          id: "agenda-2026-01",
          title: "Agenda and recording archive",
          href: externalLinks.oldRecords,
          kind: "archive",
          date: "2026-01-26"
        }
      ]
    }
  ],
  departments: [
    {
      id: "dept-town-hall",
      slug: "town-hall",
      name: "Town Hall",
      summary: "General town administration, clerk services, business licensing, depot rental, and mayor contact routing.",
      contact: {
        label: "Town Hall",
        phone: "864-543-2200",
        address: "120 Main Street W, Ninety Six, SC 29666"
      },
      services: ["Business licensing", "Depot rental", "Council requests", "General assistance"]
    },
    {
      id: "dept-police",
      slug: "police",
      name: "Police Department",
      summary: "Public safety service and municipal police contact.",
      contact: {
        label: "Police Department",
        phone: "864-543-2200 option 4"
      },
      services: ["Public safety", "Police contact", "Ticket questions"]
    },
    {
      id: "dept-fire",
      slug: "fire",
      name: "Fire Department",
      summary: "Fire response and safety service for the Ninety Six community.",
      contact: {
        label: "Fire Department",
        phone: "864-543-2200 option 5"
      },
      services: ["Fire response", "Safety information"]
    },
    {
      id: "dept-streets",
      slug: "streets-sanitation",
      name: "Streets and Sanitation",
      summary: "Street, maintenance, and sanitation support.",
      contact: {
        label: "Maintenance Department",
        phone: "864-543-2200 option 8"
      },
      services: ["Street maintenance", "Sanitation", "Trash collection support"]
    },
    {
      id: "dept-tourism",
      slug: "tourism",
      name: "Tourism and Visitor Center",
      summary: "Visitor information, town history, tourism, and local event support.",
      contact: {
        label: "Visitor Center",
        phone: "864-543-2200 option 7",
        address: "97 E. Main Street, Ninety Six, SC 29666"
      },
      services: ["Visitor information", "Tourism", "Events"]
    }
  ],
  officials: [
    {
      id: "official-mayor",
      name: "Gregg Brown",
      role: "Mayor",
      email: "mayor@ninetysixsc.gov"
    },
    {
      id: "official-ward-1",
      name: "Michael Ray Goodman",
      role: "Councilmember",
      ward: "Ward 1",
      email: "mgoodman@ninetysixsc.gov",
      committees: ["Street and Maintenance", "Public Safety", "Building Maintenance"]
    },
    {
      id: "official-ward-2",
      name: "Bridget Porter",
      role: "Councilmember",
      ward: "Ward 2",
      email: "bporter@ninetysixsc.gov",
      committees: ["Building Maintenance"]
    },
    {
      id: "official-ward-3",
      name: "April Prater",
      role: "Councilmember",
      ward: "Ward 3",
      email: "aprater@ninetysixsc.gov"
    },
    {
      id: "official-ward-4",
      name: "Tara Brown",
      role: "Councilmember",
      ward: "Ward 4",
      email: "tbrown@ninetysixsc.gov",
      committees: ["Public Safety"]
    },
    {
      id: "official-ward-5",
      name: "Gracen I Price",
      role: "Councilmember",
      ward: "Ward 5",
      email: "giprice@ninetysixsc.gov",
      committees: ["Planning"]
    },
    {
      id: "official-ward-6",
      name: "Karen Roller",
      role: "Councilmember",
      ward: "Ward 6",
      email: "kroller@ninetysixsc.gov"
    }
  ],
  staff: [
    {
      id: "staff-town-clerk",
      name: "Town Clerk",
      role: "Town Hall Clerk",
      department: "Town Hall",
      phone: "864-543-2200 option 1"
    },
    {
      id: "staff-municipal-court",
      name: "Municipal Court Clerk",
      role: "Municipal Court Clerk",
      department: "Municipal Court",
      phone: "864-543-2200 option 2"
    },
    {
      id: "staff-visitor-center",
      name: "Visitor Center",
      role: "Visitor information",
      department: "Tourism and Visitor Center",
      phone: "864-543-2200 option 7"
    }
  ],
  documents: [
    {
      id: "ward-map",
      title: "Ward map archive",
      href: "https://townofninetysix.sc.gov/town-council",
      kind: "map"
    },
    {
      id: "legacy-records",
      title: "Legacy meeting records",
      href: externalLinks.oldRecords,
      kind: "archive"
    }
  ],
  externalLinks: [
    {
      id: "link-ticket",
      title: "Pay Your Ticket Online",
      href: externalLinks.ticketPayment,
      description: "Official Greenwood County public index payment system.",
      type: "payment"
    },
    {
      id: "link-business",
      title: "Renew Business License",
      href: externalLinks.businessLicensePortal,
      description: "GovPossible renewal portal for Town of Ninety Six business licenses.",
      type: "payment"
    },
    {
      id: "link-ordinances",
      title: "Code of Ordinances",
      href: externalLinks.ordinances,
      description: "Municode ordinance library for the Town of Ninety Six.",
      type: "ordinance"
    },
    {
      id: "link-dnr",
      title: "SC DNR Licensing",
      href: externalLinks.dnrLicensing,
      description: "State outdoor licensing through the South Carolina Department of Natural Resources.",
      type: "state"
    },
    {
      id: "link-records",
      title: "Legacy Meeting Archive",
      href: externalLinks.oldRecords,
      description: "Current Drupal archive for older agendas, minutes, attachments, and recordings.",
      type: "archive"
    }
  ]
};
