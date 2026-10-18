# AgriConnect — Database Design & MongoDB Cluster Setup

## 1. Connecting to MongoDB Atlas Cluster

AgriConnect uses Mongoose to connect to MongoDB Atlas.

### Connection String Format
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/agriconnect?retryWrites=true&w=majority&appName=AgriConnect
```

### Step-by-Step Atlas Setup:
1. **Create/Open Cluster**: Go to [MongoDB Atlas](https://cloud.mongodb.com) and create or select your Cluster.
2. **Network Access (IP Whitelist)**:
   - Go to **Security > Network Access**.
   - Click **Add IP Address**.
   - For local development, choose **Allow Access from Anywhere (`0.0.0.0/0`)** or add your current IP address.
3. **Database Access (User Credentials)**:
   - Go to **Security > Database Access**.
   - Click **Add New Database User**.
   - Select **Password** authentication.
   - Enter a username (e.g. `agriadmin`) and a secure password.
   - **Crucial**: If your password contains special characters like `@`, `#`, `:`, `?`, `%`, or `/`, you must URL-encode them (e.g., `@` becomes `%40`).
   - Assign built-in role: **Read and write to any database**.
4. **Get Connection String**:
   - Go to **Deployments > Database**.
   - Click **Connect** on your cluster.
   - Select **Drivers (Node.js)**.
   - Copy the URI and replace `<password>` with your database user password and specify the database name (`agriconnect`).
   - Paste it into `server/.env`:
     ```env
     MONGODB_URI=mongodb+srv://agriadmin:YourPasswordHere@cluster0.abcde.mongodb.net/agriconnect?retryWrites=true&w=majority
     ```
5. **Populate with Initial Data**:
   Run the seed script in the server directory:
   ```bash
   cd server
   npm run seed
   ```

---

## 2. Collections & Schema Architecture

### 1. `users`
- `_id`: ObjectId
- `name`: String (required)
- `email`: String (unique, required)
- `phone`: String (optional)
- `passwordHash`: String (required)
- `role`: Enum `['farmer', 'buyer', 'officer', 'admin']` (required)
- `status`: Enum `['active', 'pending_verification', 'suspended']` (default: 'active')
- `avatar`: String
- `language`: Enum `['en', 'or', 'hi']` (default: 'en')
- `createdAt`, `updatedAt`: Date

### 2. `farmerProfiles`
- `_id`: ObjectId
- `userId`: ObjectId -> users._id (unique)
- `village`: String
- `district`: String
- `state`: String
- `farmSizeAcres`: Number
- `cropsGrown`: [String]
- `preferredLanguage`: String
- `kisanCreditCard`: Boolean
- `irrigationType`: String

### 3. `farms`
- `_id`: ObjectId
- `farmerId`: ObjectId -> users._id
- `name`: String
- `village`: String
- `district`: String
- `state`: String
- `areaAcres`: Number
- `soilType`: String
- `irrigationSource`: String
- `notes`: String
- `createdAt`: Date

### 4. `cropRecords`
- `_id`: ObjectId
- `farmId`: ObjectId -> farms._id
- `farmerId`: ObjectId -> users._id
- `cropName`: String
- `variety`: String
- `sowingDate`: Date
- `expectedHarvestDate`: Date
- `stage`: Enum `['sowing', 'vegetative', 'flowering', 'ripening', 'harvest_ready', 'harvested']`
- `estimatedProductionQuintals`: Number
- `irrigationNotes`: String
- `activities`: [{ date: Date, title: String, notes: String }]

### 5. `marketPrices`
- `_id`: ObjectId
- `crop`: String
- `market`: String (Mandi name)
- `district`: String
- `state`: String
- `minPrice`: Number (INR per quintal)
- `maxPrice`: Number (INR per quintal)
- `modalPrice`: Number (INR per quintal)
- `date`: Date
- `source`: String (e.g., 'Agmarknet / Directorate of Marketing & Inspection')
- `priceTrend`: Enum `['up', 'down', 'stable']`

### 6. `schemes`
- `_id`: ObjectId
- `title`: String
- `state`: String ('All-India' or state specific e.g. 'Odisha')
- `category`: String (Financial, Insurance, Irrigation, Seeds)
- `description`: String
- `benefits`: String
- `eligibilityCriteria`: {
    minLandAcres?: Number,
    maxLandAcres?: Number,
    allowedStates?: [String],
    allowedCrops?: [String],
    requiresKcc?: Boolean
  }
- `documentsRequired`: [String]
- `deadline`: Date or String
- `officialUrl`: String
- `department`: String
- `isActive`: Boolean

### 7. `savedSchemes`
- `_id`: ObjectId
- `farmerId`: ObjectId -> users._id
- `schemeId`: ObjectId -> schemes._id
- `notes`: String
- `checklist`: [{ item: String, completed: Boolean }]
- `savedAt`: Date

### 8. `listings` (Marketplace)
- `_id`: ObjectId
- `farmerId`: ObjectId -> users._id
- `farmerName`: String
- `crop`: String
- `variety`: String
- `quantityAvailable`: Number
- `unit`: String (Quintal, Kg, Ton)
- `pricePerUnit`: Number (INR)
- `qualityGrade`: String ('Grade A', 'Organic', 'Fair Average Quality')
- `location`: { village: String, district: String, state: String }
- `availabilityDate`: Date
- `status`: Enum `['active', 'reserved', 'sold', 'unlisted']`
- `images`: [String]
- `description`: String

### 9. `orders`
- `_id`: ObjectId
- `buyerId`: ObjectId -> users._id
- `farmerId`: ObjectId -> users._id
- `listingId`: ObjectId -> listings._id
- `crop`: String
- `quantity`: Number
- `unit`: String
- `offeredPricePerUnit`: Number
- `totalAmount`: Number
- `status`: Enum `['inquiry', 'negotiating', 'accepted', 'rejected', 'completed', 'cancelled']`
- `messages`: [{ senderId: ObjectId, text: String, proposedPrice?: Number, timestamp: Date }]
- `counterPrice`: Number
- `createdAt`, `updatedAt`: Date

### 10. `supportTickets`
- `_id`: ObjectId
- `farmerId`: ObjectId -> users._id
- `farmerName`: String
- `assignedOfficerId`: ObjectId -> users._id (optional)
- `category`: Enum `['crop_issue', 'pest_disease', 'scheme_help', 'irrigation', 'general']`
- `district`: String
- `subject`: String
- `description`: String
- `cropName`: String
- `photoUrl`: String
- `priority`: Enum `['low', 'medium', 'high', 'urgent']`
- `status`: Enum `['open', 'in_progress', 'resolved', 'closed']`
- `messages`: [{ senderId: ObjectId, senderName: String, senderRole: String, text: String, internalOnly: Boolean, createdAt: Date }]
- `resolutionNotes`: String

### 11. `notifications`
- `_id`: ObjectId
- `recipientId`: ObjectId -> users._id
- `type`: Enum `['order', 'ticket', 'weather_alert', 'scheme', 'system']`
- `title`: String
- `message`: String
- `link`: String
- `readAt`: Date (null if unread)
- `createdAt`: Date

### 12. `auditLogs`
- `_id`: ObjectId
- `actorId`: ObjectId -> users._id
- `actorName`: String
- `action`: String
- `entityType`: String
- `entityId`: String
- `details`: Object
- `timestamp`: Date
