# 🏦 Simple Banking System - Microservices Cloud Deployment

A robust, full-stack microservices-based banking application designed for automated cloud deployment and management. This project demonstrates a production-grade CI/CD pipeline and cloud-native architecture using Spring Boot, React, and a modern DevOps toolchain.

## 🏗 Microservices Architecture

| Service | Responsibility | Technology |
|---|---|---|
| **Auth Service** | Identity and Access Management (AuthN/AuthZ) | Spring Boot, JWT |
| **Account Service** | Customer account management and balance tracking | Spring Boot, MySQL |
| **Transaction Service** | Fund transfers, history, and financial logging | Spring Boot, MySQL |
| **Notification Service** | Real-time alerts and user communications | Spring Boot |
| **API Gateway** | Request routing and load balancing | Spring Cloud Gateway |
| **Eureka Server** | Dynamic service registration and discovery | Netflix Eureka |
| **Banking Frontend** | Client-side dashboard and user interactions | React, Vite, TailwindCSS |

## 🛠 Tech Stack

*   **Backend**: Java 17, Spring Boot, Spring Cloud, Maven
*   **Frontend**: React.js, Vite, Node.js
*   **Database**: MySQL, Hibernate/JPA
*   **DevOps & Infrastructure**:
    *   **Infrastructure as Code**: Terraform (Azure Provisioning)
    *   **Automation**: Ansible (Kubernetes Deployment)
    *   **Containerization**: Docker, Docker Compose
    *   **Orchestration**: Azure Kubernetes Service (AKS)
    *   **Repository**: Azure Container Registry (ACR)
    *   **CI/CD**: Azure Pipelines, Jenkins (Hybrid)

## 🚀 Cloud Deployment Workflow

This project is built around a fully automated deployment pipeline:

1.  **Infrastructure Initialization**: Terraform provisions the Azure Resource Group, AKS Cluster, and ACR.
2.  **Continuous Integration**: Changes to `main` trigger the pipeline to build Docker images for each microservice.
3.  **Image Repository**: Verified images are tagged and pushed to the Azure Container Registry.
4.  **Deployment**: Ansible playbooks are executed to apply Kubernetes manifests and pull the newly built images into the AKS cluster.

## ⚙️ CI/CD Configurations

*   **Azure Pipelines**: Defined in `azure-pipelines.yml`. Manages the full cloud lifecycle.
*   **Jenkins**: A local-friendly `Jenkinsfile` is provided for running builds on your own instance.

## 📦 Getting Started

### Local Development (Docker Compose)
To run the entire system locally with one command:
```bash
docker-compose up --build
```

### Infrastructure Provisioning
To set up your Azure cloud environment:
```bash
cd terraform
terraform init
terraform apply -auto-approve
```

## 🔐 Security Note
For local testing or use with Jenkins, ensure your secrets (Azure Client ID, ACR login, etc.) are managed through **Jenkins Credentials** or **Azure Key Vault**. Never commit sensitive keys directly to the repository.

---
**Developed for Cloud Computing Project.**