pipeline {
    agent any

    environment {
        KUBECONFIG = '/var/jenkins_home/kubeconfig'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo 'Railway Emergency Project'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t railway-backend:1.0 ./backend_flask'
            }
        }

        stage('Load Image into Minikube') {
            steps {
                sh 'docker save railway-backend:1.0 | docker exec -i minikube ctr -n k8s.io images import -'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f backend-deployment.yaml'
                sh 'kubectl apply -f backend-service.yaml'
                sh 'kubectl rollout restart deployment/railway-backend'
                sh 'kubectl rollout status deployment/railway-backend --timeout=120s'
            }
        }

        stage('Verify Deployment') {
            steps {
                sh 'kubectl get pods'
                sh 'kubectl get services'
            }
        }
    }
}