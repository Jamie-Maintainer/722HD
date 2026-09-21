# Automated Blue/Green Deployment with Smoke Testing and Rollback

This repository contains a **static KoalaTech University homepage**.

Infrastructure is split into two layers:

1. **Terraform (manual)** creates the Azure base resources: Resource Group, Azure Container Registry, and AKS.
2. **GitHub Actions** builds the frontend image, deploys Kubernetes workloads, runs smoke tests, switches production traffic, and rolls back automatically if the post-switch test fails.

---

## Architecture

Blue and green run as two Deployments in the same `production` namespace.

```text
                         ┌────────────────────────────────┐
                         │ frontend-production            │
                         │ Service type: LoadBalancer     │
                         │ selector: app=frontend,        │
                         │           slot=blue|green      │
                         │ stable public IP               │
                         └───────────────┬────────────────┘
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   ▼                                           ▼
        ┌─────────────────────┐                     ┌─────────────────────┐
        │ frontend-blue       │                     │ frontend-green      │
        │ Deployment          │                     │ Deployment          │
        └──────────┬──────────┘                     └──────────┬──────────┘
                   │                                           │
        ┌──────────┴──────────┐                     ┌──────────┴──────────┐
        │ frontend-blue       │                     │ frontend-green      │
        │ ClusterIP (smoke)   │                     │ ClusterIP (smoke)   │
        └─────────────────────┘                     └─────────────────────┘
```

- **Production Service** is a LoadBalancer. It is created once, so the public IP stays the same.
- Blue/Green switching only changes `spec.selector.slot` on that Service.
- Each slot has an internal ClusterIP Service used for **pre-switch smoke testing**. Production traffic never uses those Services.

---

## 1. Create base infrastructure with Terraform

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

Copy these Terraform outputs into GitHub Actions variables:

| Terraform output     | GitHub variable     |
| -------------------- | ------------------- |
| `acr_name`           | `ACR_NAME`          |
| `acr_login_server`   | `ACR_LOGIN_SERVER`  |
| `resource_group_name`| `AKS_RESOURCE_GROUP`|
| `aks_cluster_name`   | `AKS_CLUSTER_NAME`  |

Confirm the cluster is ready:

```bash
az aks get-credentials --resource-group <rg> --name <aks> --overwrite-existing
kubectl get nodes
```

---

## 2. GitHub configuration

### Repository secret

```text
AZURE_CREDENTIALS
```

```json
{
  "clientId": "YOUR_CLIENT_ID",
  "clientSecret": "YOUR_CLIENT_SECRET",
  "subscriptionId": "YOUR_SUBSCRIPTION_ID",
  "tenantId": "YOUR_TENANT_ID"
}
```

The Service Principal must be able to push images to ACR and deploy to AKS.

### Repository variables

| Type                | Name                 |
| ------------------- | -------------------- |
| Repository Secret   | `AZURE_CREDENTIALS`  |
| Repository Variable | `ACR_NAME`           |
| Repository Variable | `ACR_LOGIN_SERVER`   |
| Repository Variable | `AKS_RESOURCE_GROUP` |
| Repository Variable | `AKS_CLUSTER_NAME`   |

### GitHub Environment

Create a `production` environment. The Blue/Green workflow uses it.

---

## 3. GitHub Actions workflows

```text
.github/workflows/
  ci.yml
  blue-green-deploy.yml
```

### Workflow 1: CI

**Trigger:** push to `main`, or pull request targeting `main`

Steps:

- lint
- unit tests
- production build
- Kubernetes manifest validation
- Terraform validation

### Workflow 2: Blue/Green Deploy

**Trigger:** manual `workflow_dispatch`

Inputs:

- `image_tag` – Docker image tag to build and deploy
- `target_env` – `blue` or `green`
- `switch_production` – whether to point production traffic at the target after internal smoke tests pass

Steps:

1. Build image
2. Push image to ACR
3. Deploy to the target environment
4. Internal smoke test (ClusterIP)
5. Decide whether production traffic should switch
6. Switch traffic (change Production Service selector)
7. Post-switch production smoke test (LoadBalancer public IP)
8. Roll back automatically if the post-switch test fails

Recommended sequence:

1. Deploy to `green` with `switch_production = true` for the first release.
2. Later releases go to the inactive slot. If production currently points at `green`, deploy `blue`, then switch.

To deploy without changing live traffic, set `switch_production = false`. The target slot is still built, deployed, and smoke-tested.

---

## 4. Verify a deployment

```bash
kubectl get deploy,pods,svc -n production

kubectl get svc frontend-production -n production \
  -o jsonpath='{.spec.selector.slot}{"\n"}{.status.loadBalancer.ingress[0].ip}{"\n"}'
```

Open `http://<PRODUCTION-IP>/` and confirm the homepage shows **KoalaTech University**.

---

## Local development

```bash
cd frontend
npm install
npm run dev
```

Or:

```bash
docker compose up --build
```

The frontend is then available at `http://localhost:3000`.
