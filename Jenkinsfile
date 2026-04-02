pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        timeout(time: 60, unit: 'MINUTES')
    }

    environment {
        // Change these values to match your Jenkins Credentials IDs
        AZURE_CREDENTIALS_ID = 'azure-service-principal'
        ACR_CREDENTIALS_ID = 'acr-credentials' 
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
                    // Login to ACR before pushing
                    withCredentials([usernamePassword(credentialsId: "${ACR_CREDENTIALS_ID}", usernameVariable: 'ACR_USER', passwordVariable: 'ACR_PASS')]) {
                        sh "docker login ${ACR_REGISTRY} -u $ACR_USER -p $ACR_PASS"
                    }

                    def services = [
                        'auth-service', 'account-service', 'transaction-service', 
                        'notification-service', 'eureka-server', 'api-gateway', 
                        'banking-frontend'
                    ]
                    
                    services.each { service ->
                        stage("Building ${service}") {
                            // Fix: Use project root as context to match Azure pipeline and Dockerfile expectations
                            sh "docker build -t ${ACR_REGISTRY}/microservices-${service}:${BUILD_NUMBER} -f ${service}/Dockerfile ."
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
                // Ensure dependencies are installed
                sh 'pip install ansible kubernetes openshift'
                sh 'ansible-galaxy collection install kubernetes.core'
                
                sh "az aks get-credentials --resource-group ${RESOURCE_GROUP} --name ${AKS_CLUSTER_NAME} --file ${KUBECONFIG} --overwrite-existing"
                // Pass kubeconfig_path to Ansible
                sh "export KUBECONFIG=${KUBECONFIG} && ansible-playbook ansible/deploy-k8s.yaml -e kubeconfig_path=${KUBECONFIG}"
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
