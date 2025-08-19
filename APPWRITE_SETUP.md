# 🗄️ Appwrite Database Setup Guide

This guide provides complete instructions for setting up the Appwrite database collections required for the Digital Ecosystem Garden project.

## 📋 Database Overview

The Digital Ecosystem Garden requires **3 main collections** in your Appwrite database:

1. **`entities`** - Stores digital beings/creatures
2. **`structures`** - Ecosystem buildings and constructions (future feature)
3. **`donations`** - Payment tracking and donation records

---

## 🚀 Quick Setup Steps

1. **Create Appwrite Project**
   - Go to [https://cloud.appwrite.io/](https://cloud.appwrite.io/)
   - Create a new project
   - Copy the Project ID

2. **Create Database**
   - Navigate to "Databases" in your project
   - Create a new database
   - Copy the Database ID

3. **Create Collections**
   - Follow the detailed specifications below for each collection

---

## 📊 Collection 1: `entities`

**Collection ID:** `entities`  
**Purpose:** Stores all digital beings created through donations

### Attributes

| Field Name | Type | Size | Required | Default | Array | Description |
|------------|------|------|----------|---------|-------|-------------|
| `name` | String | 100 | ✅ | - | ❌ | Creature's AI-generated name |
| `donorEmail` | String | 320 | ✅ | - | ❌ | Email of person who donated |
| `species` | String | 100 | ✅ | - | ❌ | AI-generated species type |
| `personality` | String | 1000 | ✅ | - | ❌ | JSON string of personality data |
| `appearance` | String | 1000 | ✅ | - | ❌ | JSON string of visual appearance |
| `position` | String | 200 | ✅ | - | ❌ | JSON string of x,y coordinates |
| `status` | String | 50 | ❌ | `exploring` | ❌ | Current behavior state |
| `relationships` | String | 50 | ❌ | - | ✅ | Array of related entity IDs |
| `createdAt` | DateTime | - | ✅ | - | ❌ | Creation timestamp |
| `lastActive` | DateTime | - | ✅ | - | ❌ | Last activity timestamp |

### Detailed Attribute Configuration

#### 📝 Basic Information
```
name:
  - Type: String
  - Size: 100
  - Required: Yes
  - Example: "Zephyr the Curious", "Crystal Mind"
```

```
donorEmail:
  - Type: String
  - Size: 320 (max email length)
  - Required: Yes
  - Example: "donor@example.com"
```

```
species:
  - Type: String
  - Size: 100
  - Required: Yes
  - Example: "Digital Wanderer", "Crystalline Being"
```

#### 🧠 Personality & Appearance (JSON Strings)
```
personality:
  - Type: String (JSON)
  - Size: 1000
  - Required: Yes
  - Structure: {"traits": ["curious", "social"], "energy": 75}
  - Valid traits: curious, social, creative, energetic, calm, mysterious, protective, playful
  - Energy range: 0-100
```

```
appearance:
  - Type: String (JSON)
  - Size: 1000
  - Required: Yes
  - Structure: {
      "color": "#FF5733",
      "size": 1.2,
      "shape": "circle",
      "features": ["glowing_eyes", "energy_aura"]
    }
  - Valid colors: Hex format (#RRGGBB)
  - Size range: 0.5-2.0
  - Valid shapes: circle, triangle, hexagon, diamond, star
  - Valid features: glowing_eyes, crystal_spikes, energy_aura, particle_trail, geometric_pattern, flowing_tendrils, rotating_symbols
```

#### 📍 Position & Status
```
position:
  - Type: String (JSON)
  - Size: 200
  - Required: Yes
  - Structure: {"x": 150.5, "y": 300.2}
  - X range: 50-1150 (canvas boundaries)
  - Y range: 50-750 (canvas boundaries)
```

```
status:
  - Type: String
  - Size: 50
  - Required: No
  - Default: "exploring"
  - Valid values: exploring, building, socializing, resting
```

#### 🤝 Relationships & Timestamps
```
relationships:
  - Type: String
  - Size: 50
  - Required: No
  - Array: Yes
  - Contains: Entity IDs of related creatures
  - Note: Arrays cannot have default values in Appwrite
```

```
createdAt:
  - Type: DateTime
  - Required: Yes
  - Auto-generated on creation
```

```
lastActive:
  - Type: DateTime
  - Required: Yes
  - Updated when creature performs actions
```

### Permissions
- **Create**: Users (for webhook creation)
- **Read**: Any (public viewing)
- **Update**: Users (for behavior updates)
- **Delete**: Users (for admin management)

### Indexes
- `donorEmail` (for filtering by donor)
- `status` (for behavior queries)
- `createdAt` (for chronological sorting)

---

## 🏗️ Collection 2: `structures`

**Collection ID:** `structures`  
**Purpose:** Stores buildings and constructions in the ecosystem (future feature)

### Attributes

| Field Name | Type | Size | Required | Default | Array | Description |
|------------|------|------|----------|---------|-------|-------------|
| `name` | String | 100 | ✅ | - | ❌ | Structure name |
| `type` | String | 50 | ✅ | - | ❌ | Structure type |
| `position` | String | 200 | ✅ | - | ❌ | JSON string of x,y coordinates |
| `builders` | String | 50 | ❌ | - | ✅ | Array of entity IDs who built it |
| `progress` | Integer | - | ❌ | `0` | ❌ | Construction progress 0-100 |
| `createdAt` | DateTime | - | ✅ | - | ❌ | Creation timestamp |

### Detailed Attribute Configuration

```
name:
  - Type: String
  - Size: 100
  - Required: Yes
  - Example: "Crystal Spire", "Gathering Circle"
```

```
type:
  - Type: String
  - Size: 50
  - Required: Yes
  - Valid values: home, gathering, monument
```

```
position:
  - Type: String (JSON)
  - Size: 200
  - Required: Yes
  - Structure: {"x": 500.0, "y": 400.0}
```

```
builders:
  - Type: String
  - Size: 50
  - Required: No
  - Array: Yes
  - Contains: Entity IDs of creatures who participated in building
  - Note: Arrays cannot have default values in Appwrite
```

```
progress:
  - Type: Integer
  - Required: No
  - Default: 0
  - Range: 0-100 (percentage complete)
```

```
createdAt:
  - Type: DateTime
  - Required: Yes
  - Auto-generated
```

### Permissions
- **Create**: Users
- **Read**: Any
- **Update**: Users
- **Delete**: Users

---

## 💰 Collection 3: `donations`

**Collection ID:** `donations`  
**Purpose:** Tracks payment records and links them to created entities

### Attributes

| Field Name | Type | Size | Required | Default | Array | Description |
|------------|------|------|----------|---------|-------|-------------|
| `email` | String | 320 | ✅ | - | ❌ | Donor's email address |
| `amount` | Float | - | ✅ | - | ❌ | Donation amount in USD |
| `entityId` | String | 50 | ✅ | - | ❌ | ID of created entity |
| `stripeSessionId` | String | 200 | ✅ | - | ❌ | Stripe checkout session ID |
| `status` | String | 20 | ❌ | `pending` | ❌ | Payment status |
| `createdAt` | DateTime | - | ✅ | - | ❌ | Donation timestamp |

### Detailed Attribute Configuration

```
email:
  - Type: String
  - Size: 320
  - Required: Yes
  - Example: "donor@example.com"
```

```
amount:
  - Type: Float
  - Required: Yes
  - Minimum: 1.00
  - Example: 5.50, 10.00, 25.00
```

```
entityId:
  - Type: String
  - Size: 50
  - Required: Yes
  - Links to the entities collection
  - Example: "64f1a2b3c4d5e6f7g8h9i0j1"
```

```
stripeSessionId:
  - Type: String
  - Size: 200
  - Required: Yes
  - Stripe's unique session identifier
  - Example: "cs_test_1234567890abcdef"
```

```
status:
  - Type: String
  - Size: 20
  - Required: No
  - Default: "pending"
  - Valid values: pending, completed, failed, refunded
```

```
createdAt:
  - Type: DateTime
  - Required: Yes
  - Timestamp of donation
```

### Permissions (SECURITY FOCUSED)
- **Create**: API Key only (webhook exclusive access)
- **Read**: Admins only (no public access to payment data)
- **Update**: API Key only (webhook status updates)
- **Delete**: Admins only (compliance cleanup)

### 🔒 Recommended Security Settings:
```
Create: role:admin, role:webhook
Read: role:admin  
Update: role:admin, role:webhook
Delete: role:admin
```

### Indexes
- `email` (for donor lookup)
- `stripeSessionId` (for webhook processing)
- `status` (for payment filtering)
- `createdAt` (for reporting)

---

## 🔧 Appwrite Console Setup Instructions

### Step 1: Create Collections

1. **Navigate to Databases** in your Appwrite project
2. **Select your database**
3. **Click "Create Collection"**
4. **Enter collection ID** (entities, structures, or donations)
5. **Set permissions** as specified above

### Step 2: Add Attributes

For each collection:

1. **Click "Create Attribute"**
2. **Select attribute type** (String, Integer, Float, DateTime)
3. **Enter attribute key** (exact names from tables above)
4. **Set size** for string attributes
5. **Configure required/optional**
6. **Set default values** where specified
7. **Enable array** for array fields

### Step 3: Configure Permissions

For each collection, set permissions:

```bash
# Example for entities collection
Create: users
Read: any
Update: users  
Delete: users
```

### Step 4: Create Indexes

For performance optimization:

```bash
# entities collection indexes
- donorEmail (single)
- status (single)
- createdAt (single)

# donations collection indexes  
- email (single)
- stripeSessionId (single)
- status (single)
```

---

## 🧪 Testing Your Setup

### 1. Test Database Connection

Create a simple test in your application:

```typescript
import { databases, DATABASE_ID, ENTITIES_COLLECTION_ID } from '@/lib/appwrite';

// Test connection
async function testConnection() {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      ENTITIES_COLLECTION_ID
    );
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}
```

### 2. Test Entity Creation

```typescript
// Test entity creation
const testEntity = {
  name: "Test Creature",
  donorEmail: "test@example.com",
  species: "Test Species",
  personality: JSON.stringify({
    traits: ["curious"],
    energy: 50
  }),
  appearance: JSON.stringify({
    color: "#FF5733",
    size: 1.0,
    shape: "circle",
    features: ["glowing_eyes"]
  }),
  position: JSON.stringify({ x: 100, y: 100 }),
  status: "exploring",
  relationships: [],
  createdAt: new Date().toISOString(),
  lastActive: new Date().toISOString()
};
```

---

## 🔒 Security Considerations

### 1. API Key Permissions
- **Databases**: Read, Write, Create, Update, Delete
- **Documents**: Read, Write, Create, Update, Delete

### 2. Collection Permissions
- Set appropriate read/write permissions
- Use "any" for public read access
- Restrict write access to authenticated users

### 3. Data Validation
- Validate JSON strings on the client side
- Implement server-side validation in webhooks
- Use TypeScript interfaces for type safety

---

## ⚠️ Important: Appwrite Default Value Limitations

**Key Rules in Appwrite**:
1. You **CANNOT** set a default value for a **required** field
2. You **CANNOT** set a default value for an **array** field

### ✅ Correct Configurations:
- **Required = Yes, Default = -** (no default allowed)
- **Required = No, Array = No, Default = "some_value"** (default allowed)
- **Required = No, Array = Yes, Default = -** (arrays can't have defaults)

### ❌ Invalid Configurations:
- **Required = Yes, Default = "some_value"** ← This will cause an error!
- **Array = Yes, Default = []** ← This will also cause an error!

### 🔧 How This Affects Your Setup:

**Fields that MUST be provided by your application:**
- `name`, `donorEmail`, `species` (required, no defaults)
- `personality`, `appearance`, `position` (required, no defaults)
- `createdAt`, `lastActive` (required, no defaults)
- `relationships` (optional array, but no default - must provide empty array `[]`)
- `builders` (optional array, but no default - must provide empty array `[]`)

**Fields with sensible defaults:**
- `status` (optional string, defaults to "exploring")
- `progress` (optional integer, defaults to 0)

### 💡 Implementation Impact:

When creating entities in your webhook, you must always provide:

```typescript
await databases.createDocument(
  DATABASE_ID,
  ENTITIES_COLLECTION_ID,
  entity.id,
  {
    // Required fields - MUST be provided
    name: entity.name,
    donorEmail: entity.donorEmail,
    species: entity.species,
    personality: JSON.stringify(entity.personality),
    appearance: JSON.stringify(entity.appearance),
    position: JSON.stringify(entity.position),
    createdAt: entity.createdAt,
    lastActive: entity.lastActive,
    
    // Array fields - MUST provide even if empty (no defaults allowed)
    relationships: [], // Must explicitly provide empty array
    
    // Optional non-array fields - can be omitted (will use defaults)
    // status: 'exploring' (default applied automatically)
  }
);
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "Collection not found"
**Solution:** Verify collection IDs match exactly in your environment variables

### Issue 2: "Permission denied"
**Solution:** Check collection permissions allow your operation

### Issue 3: "Attribute validation failed"
**Solution:** Ensure data types and sizes match the schema

### Issue 4: "JSON parsing error"
**Solution:** Validate JSON strings before storing (personality, appearance, position)

### Issue 5: "Cannot set default value for array"
**Solution:** Remove default values from array fields and always provide empty arrays `[]` in your code

### Issue 6: "Required field cannot have default"
**Solution:** Remove default values from required fields and ensure your application always provides them

---

## 📞 Support

If you encounter issues:

1. **Check Appwrite Console** for error messages
2. **Verify environment variables** match your setup
3. **Test with Appwrite's REST API** directly
4. **Check network connectivity** and API key permissions

---

**🎉 Once your database is set up correctly, your Digital Ecosystem Garden will be ready to create and manage AI-generated creatures!**