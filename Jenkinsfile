pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
    }

    environment {
        // Change these values to match your Jenkins Credentials IDs
        AZURE_CREDENTIALS_ID = 'azure-service-principal'
        ACR_REGISTRY = 'bankingacr123.azurecr.io'
        RESOURCE_GROUP = 'banking-rg'
        AKS_CLUSTER_NAME = 'banking-aks-cluster'
        KUBECONFIG = "${WORKSPACE}/kubeconfig"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Infrastructure (Terraform)') {
            when { branch 'main' }
            steps {
                dir('terraform') {
                    sh 'terraform init'
                    sh 'terraform apply -auto-approve'
                }
            }
        }

        stage('Build & Push Microservices') {
            when { branch 'main' }
            steps {
                script {
                    def services = [
                        'auth-service', 'account-service', 'transaction-service', 
                        'notification-service', 'eureka-server', 'api-gateway', 
                        'banking-frontend'
                    ]
                    
                    services.each { service ->
                        stage("Building ${service}") {
                            sh "docker build -t ${ACR_REGISTRY}/microservices-${service}:${BUILD_NUMBER} -f ${service}/Dockerfile ${service}"
                            sh "docker tag ${ACR_REGISTRY}/microservices-${service}:${BUILD_NUMBER} ${ACR_REGISTRY}/microservices-${service}:latest"
                            sh "docker push ${ACR_REGISTRY}/microservices-${service}:${BUILD_NUMBER}"
                            sh "docker push ${ACR_REGISTRY}/microservices-${service}:latest"
                        }
                    }
                }
            }
        }

        stage('Deploy to AKS (Ansible)') {
            when { branch 'main' }
            steps {
                sh "az aks get-credentials --resource-group ${RESOURCE_GROUP} --name ${AKS_CLUSTER_NAME} --file ${KUBECONFIG} --overwrite-existing"
                sh "export KUBECONFIG=${KUBECONFIG} && ansible-playbook ansible/deploy-k8s.yaml"
            }
        }
    }

    post {
        always {
            sh "rm -f ${KUBECONFIG}"
            cleanWs()
        }
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed! Please check the logs."
        }
    }
}
