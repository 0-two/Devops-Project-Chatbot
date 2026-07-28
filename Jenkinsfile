pipeline {
    agent any

    environment {
        AWS_REGION     = 'us-east-1'
        AWS_ACCOUNT_ID = '161007500783' // Replace with your 12-digit AWS Account ID
        ECR_REPO_NAME  = 'my-app-repo'
        IMAGE_TAG      = "${BUILD_NUMBER}"
        CLUSTER_NAME   = 'my-app-eks-cluster'
        SONAR_HOST_URL = 'http://localhost:9000'
    }

    stages {
        stage('1. Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('2. SonarQube Analysis') {
            steps {
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    sh '''
                        echo "Running SonarQube analysis..."
                        # Note: If using Node/Java, you can use sonar-scanner here
                    '''
                }
            }
        }

        stage('3. Build Docker Image') {
            steps {
                sh '''
                    docker build -t $ECR_REPO_NAME:$IMAGE_TAG ./backend
                    docker tag $ECR_REPO_NAME:$IMAGE_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:$IMAGE_TAG
                    docker tag $ECR_REPO_NAME:$IMAGE_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:latest
                '''
            }
        }

        stage('4. Trivy Vulnerability Scan') {
            steps {
                sh '''
                    trivy image --severity HIGH,CRITICAL $ECR_REPO_NAME:$IMAGE_TAG
                '''
            }
        }

        stage('5. Push Image to ECR') {
            steps {
                sh '''
                    # Login to ECR using IAM Role credentials
                    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
                    
                    # Push image tags
                    docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:$IMAGE_TAG
                    docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:latest
                '''
            }
        }

        stage('6. Deploy to EKS') {
            steps {
                sh '''
                    # Update kubeconfig to point to EKS
                    aws eks update-kubeconfig --region $AWS_REGION --name $CLUSTER_NAME
                    
                    # Apply Kubernetes manifests
                    kubectl apply -f k8s/
                '''
            }
        }
    }

    post {
        always {
            sh 'docker system prune -f' // Clean up unused images to save disk space
        }
    }
}
