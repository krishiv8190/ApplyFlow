User
├── id UUID PK
├── email
├── passwordHash
├── firstName
└── lastName

Application
├── id UUID PK
├── userId UUID FK → User.id
├── company
├── role
├── location
├── source ENUM
├── status ENUM
├── appliedAt TIMESTAMPTZ
├── url
├── notes
└── sourceMessageId

Exact Gmail email
↓
sourceMessageId
↓
already processed?
├── YES → skip
└── NO
↓
identify application
↓
URL if available
↓
otherwise company + role + other signals
