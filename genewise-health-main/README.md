#  PharmaGuard

AI-powered pharmacogenomic risk prediction platform that analyzes genomic VCF files to generate personalized drug safety insights and clinically explainable recommendations

## Live Demo Link

🌐 [https://your-live-link.com](https://extensively-unstabilised-maxton.ngrok-free.dev/)

## LinkedIn Video Link

🎥 [https://linkedin.com/your-demo-video](https://www.linkedin.com/posts/palak-singh-492932315_rift2026-pharmaguard-pharmacogenomics-ugcPost-7430430166746660864-95Zs?utm_source=share&utm_medium=member_android&rcm=ACoAAFAMvy4Bs7HkAcKSPFGM7AO_8FBtpTdBrnY)


## Overview

PharmaGuard is a precision medicine web application that predicts adverse drug reactions using pharmacogenomics and explainable AI. By analyzing genetic variants from VCF files, the system identifies how individuals metabolize specific drugs and generates actionable clinical insights aligned with CPIC guidelines.

The platform combines deterministic medical logic with AI-powered explanations to make pharmacogenomics accessible through a simple web interface.


## Problem Statement

Adverse drug reactions are a leading cause of preventable hospitalizations worldwide. Traditional prescribing methods rely on population averages rather than individual genetics, leading to:

* Drug toxicity in poor metabolizers
* Treatment failure in ultra-rapid metabolizers
* Lack of real-time pharmacogenomic decision tools

PharmaGuard solves this by delivering fast, interpretable genomic drug safety analysis for clinicians and researchers.


## Dataset

The system uses curated pharmacogenomic datasets derived from:

* CPIC (Clinical Pharmacogenetics Implementation Consortium) guidelines
* PharmGKB variant-drug associations
* Standard genomic VCF variant formats

Test data includes synthetic and curated genomic VCF samples representing safe, moderate-risk, and high-risk pharmacogenomic profiles.


### AI / Medical Logic

* OpenAI LLM (optional explainability layer)
* CPIC clinical rule engine
* Pharmacogenomic variant mapping

### Deployment

* ngrok (fullstack hosting)
* GitHub (source control)

## Methods

PharmaGuard uses a hybrid architecture combining deterministic medical rules with AI explanations:

1. Parse genomic VCF files
2. Extract pharmacogenomic variants
3. Map variants to key drug-metabolizing genes
4. Apply CPIC rule-based phenotype classification
5. Generate risk labels (Safe, Adjust, Toxic, Ineffective)
6. Use LLM to produce explainable clinical summaries

This ensures both accuracy and interpretability.

---

## Key Insights

* Pharmacogenomics enables personalized drug therapy
* Deterministic medical logic ensures reliability
* AI enhances interpretability and accessibility
* Even simple genomic markers can prevent severe drug reactions

The system demonstrates how AI can augment clinical genomics without replacing established medical guidelines.

## Dashboard / Model / Output

The PharmaGuard dashboard provides:

* VCF file upload interface
* Multi-drug selection
* Color-coded risk labels
* Gene-level pharmacogenomic profiles
* AI-generated explanations
* Downloadable structured JSON output

Outputs include phenotype classification, risk severity, and clinical recommendations.


## How to Run this project?

Step 1 :npm install
step 2 : run npm
step 3 : npm run dev
Exit  :Ctrl C

## API Docs
  URL: https://platform.openai.com/api-keys


Runs pharmacogenomic analysis.
**Input:**

* Multipart VCF file
* Drug list

**Output:**
JSON with risk classification and clinical explanation.


## Usage Examples

### Example 1 — Safe Patient

* Upload: Normal metabolizer VCF
* Result: All drugs marked Safe

### Example 2 — High Risk Patient

* Upload: CYP2C19 loss-of-function variant
* Drug: Clopidogrel
* Result: Ineffective classification + recommendation for alternative therapy

### Example 3 — Multi-Gene Risk

* Multiple variants across pharmacogenes
* System provides multi-drug warnings and phenotype mapping

## Team Members

**Krishna dev pathak**
**Abhishek yadav**
**Palak singh**
**Ishika Gupta**
