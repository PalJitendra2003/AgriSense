# AgriSense — Supabase & AI Model Integration Guide

This guide provides step-by-step instructions to connect your **AgriSense** single-page application to **Supabase Cloud** for secure farmer authentication and live cloud history logging, and connect your **custom trained ML model API** to analyze crop leaves.

---

## Part 1: Supabase Database Setup

### Step 1: Create a Supabase Project
1. Go to [Supabase.com](https://supabase.com/) and sign in or sign up.
2. Click **New Project** and select your organization.
3. Name your project (e.g., `AgriSense`) and set a strong database password.
4. Select a region close to your target farmers and click **Create New Project**.

### Step 2: Initialize the Database Schema (SQL Editor)
1. In your Supabase Dashboard, click on the **SQL Editor** tab from the left sidebar navigation (represented by the `SQL` icon).
2. Click **New query** to create a blank script editor.
3. Copy and paste the following SQL script exactly:

```sql
-- ==========================================================
-- AGRISENSE CROP SCAN HISTORY SCHEMA
-- ==========================================================

-- 1. Create the scans table
CREATE TABLE public.scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    crop TEXT NOT NULL,
    disease TEXT NOT NULL,
    scientific_name TEXT NOT NULL,
    confidence TEXT NOT NULL,
    severity TEXT NOT NULL,
    description TEXT NOT NULL,
    precautions TEXT[] NOT NULL DEFAULT '{}',
    cure TEXT[] NOT NULL DEFAULT '{}',
    fertilizer TEXT NOT NULL DEFAULT 'No corrective fertilizers are required.',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Enable Row Level Security (RLS) to protect farmer records
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

-- 3. Create security policies for authenticated farmers

-- Policy A: Allow farmers to view only their own crop scans
CREATE POLICY "Farmers can view their own scans" 
ON public.scans 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Policy B: Allow farmers to insert their own crop scans
CREATE POLICY "Farmers can insert their own scans" 
ON public.scans 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Policy C: Allow farmers to delete their own crop scans
CREATE POLICY "Farmers can delete their own scans" 
ON public.scans 
FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- 4. Create database index on user_id for high-performance timeline queries
CREATE INDEX scans_user_id_idx ON public.scans (user_id);

-- ==========================================================
-- SCHEMA INITIALIZATION COMPLETE
-- ==========================================================
```

4. Click **Run** at the bottom right. You should see a success message: `Success. No rows returned.`

---

## Part 2: Client Application Integration

Now, you need to plug your Supabase credentials into the client-side code.

### Step 1: Retrieve API Keys
1. In the Supabase Dashboard, click on the **Settings** icon (gear icon) at the bottom of the left sidebar.
2. Select the **API** sub-menu.
3. Under the **Project API keys** section:
   - Copy the **Project URL** (under the `Project URL` header).
   - Copy the **anon / public** key (under the `Project API keys` header). *Make sure to copy the `anon` key, NOT the `service_role` key!*

### Step 2: Configure Client Keys
1. Open the file [js/app.js](file:///e:/QHack/js/app.js) in your text editor.
2. At the top of the file (lines 8–13), locate the project configuration section.
3. Paste your copied values inside the empty strings:

```javascript
// ==========================================
// 1. PROJECT CONFIGURATION SETTINGS
// ==========================================
const SUPABASE_URL = "https://your-project-id.supabase.co";         // Paste your Supabase project URL here
const SUPABASE_ANON_KEY = "your-anon-public-key-here";    // Paste your Supabase Anon API key here
const AI_MODEL_API_URL = "https://your-trained-model-api.com/predict";     // Paste your Pre-trained AI API Endpoint here
```

4. Save the file.
5. Open AgriSense in your browser or refresh the page. The top status banner will dynamically transition to a glowing green badge:
   `Cloud Sync Active: Secured and connected to Supabase Cloud Core. All Farmer logs are synced.`

---

## Part 3: Custom ML Model API Integration

Your custom trained model will accept a leaf image file and return the predicted category and confidence. The client app will automatically normalise the output and retrieve agronomist-verified details from the local knowledge base.

### Model API Requirements
Your pre-trained API endpoint (`AI_MODEL_API_URL`) should handle an `HTTP POST` request containing the image file as a form-data parameter under the field name `file`.

#### Example Expected JSON Response:
```json
{
  "category": "tomato_early_blight",
  "confidence": 0.948
}
```

### Supported API Response Formats
The AgriSense prediction engine is highly flexible. The model response properties will be normalized automatically:
- **Category Identifiers**: Supported properties include `category`, `disease_id`, `disease`, `label`, and `class`.
- **Confidence Rates**: Accepts decimal floats (e.g. `0.948`) or percentage strings (e.g. `"94.8%"`). Handles floats like `94.8` safely.

### Crop Disease Category Identifiers Reference Table
Make sure your custom ML model maps its classes to the following standard category keys to retrieve beautiful agronomist-verified treatments and bilingual translations instantly:

| Crop | Disease | Model Class Key (`category`) | Suggested Corrective Fertilizers |
| :--- | :--- | :--- | :--- |
| **Tomato** | Early Blight | `tomato_early_blight` | High-potassium foliar spray to strengthen cell walls & calcium to prevent physiological cracking. |
| **Tomato** | Leaf Mold | `tomato_leaf_mold` | Calcium-rich foliar feed to optimize transpiration & organic compost tea to suppress fungal spores. |
| **Corn** | Common Rust | `corn_common_rust` | Nitrogen-Phosphorus-Potassium (NPK) with sulfur and zinc micro-nutrients to build foliar resistance. |
| **Potato** | Late Blight | `potato_late_blight` | Phosphite-based liquid nutrients to stimulate immune defense. Avoid high nitrogen which triggers dense foliage. |
| **Apple** | Apple Scab | `apple_scab` | High-potash organic fertilizer or liquid seaweed extracts in late spring to boost tree resilience. |
| **Rice** | Rice Blast | `rice_blast` | Silicon-based foliar supplements to strengthen leaf epidermal layers & adequate potassium. |
| **Grape** | Black Rot | `grape_black_rot` | Organic compost mulches at the root base & zinc, boron, and magnesium to support healthy berries. |
| **Citrus** | Citrus Canker | `citrus_canker` | Copper-chelated foliar fertilizers to suppress bacteriosis & adequate calcium/magnesium. |
| **General** | Healthy Crop | `healthy_crop` | No corrective fertilizers needed. Standard organic compost applications & micro-nutrients. |

---

### Step-by-Step API Normalization Workflow
The integration logic inside `js/app.js` is fully optimized to run this exact workflow under the hood:
1. **API Call**: Submits the crop leaf image to the user's ML API.
2. **Key Extraction**: Normalizes keys so that if the model returns class names like standard PlantVillage names (e.g. `Tomato___Early_blight`), it resolves to our dictionary.
3. **Database Match**: Pulls agronomist-verified descriptions, suggested fertilizers, precautions, and cures.
4. **Cloud Log**: Creates a record with these rich fields and syncs it securely to your Supabase `scans` table using RLS.
5. **Display**: Renders the circular confidence gauge meter, active threat levels, precautions checklist, immediate cure alert box, and suggested fertilizers.
