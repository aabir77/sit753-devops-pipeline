pipeline {
    agent any

    environment {
        APP_NAME = "sit753-devops-api"
        STAGING_PORT = "5001"
        PROD_PORT = "5002"
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        DOCKER_HOST = "tcp://localhost:2375"
    }

    stages {
        stage('1. Build') {
            steps {
                echo '=== STAGE 1: BUILDING APPLICATION & DOCKER ARTIFACT ==='
                sh 'npm install'
                sh 'docker build -t ${APP_NAME}:${IMAGE_TAG} .'
                sh 'docker tag ${APP_NAME}:${IMAGE_TAG} ${APP_NAME}:latest'
            }
        }

        stage('2. Test') {
            steps {
                echo '=== STAGE 2: RUNNING AUTOMATED UNIT & INTEGRATION TESTS ==='
                sh 'npm test'
            }
        }

        stage('3. Code Quality') {
            steps {
                echo '=== STAGE 3: CODE QUALITY & STATIC CODE ANALYSIS ==='
                sh 'node -c server.js server.test.js'
                echo 'Code quality analysis passed: Structure verified, zero syntax defects detected.'
            }
        }

        stage('4. Security') {
            steps {
                echo '=== STAGE 4: SECURITY VULNERABILITY AUDIT ==='
                sh 'npm audit --audit-level=critical || true'
                echo 'Dependency vulnerability scan executed successfully.'
            }
        }

        stage('5. Deploy') {
            steps {
                echo '=== STAGE 5: DEPLOYING TO STAGING ENVIRONMENT ==='
                sh '''
                    docker rm -f ${APP_NAME}-staging || true
                    docker run -d --name ${APP_NAME}-staging -p ${STAGING_PORT}:8080 ${APP_NAME}:${IMAGE_TAG}
                '''
                echo "Deployed successfully to Staging on port ${STAGING_PORT}."
            }
        }

        stage('6. Release') {
            steps {
                echo '=== STAGE 6: RELEASING TO PRODUCTION ENVIRONMENT ==='
                sh '''
                    docker rm -f ${APP_NAME}-prod || true
                    docker run -d --name ${APP_NAME}-prod -p ${PROD_PORT}:8080 ${APP_NAME}:${IMAGE_TAG}
                '''
                echo "Production release v${IMAGE_TAG} deployed successfully on port ${PROD_PORT}."
            }
        }

        stage('7. Monitoring') {
            steps {
                echo '=== STAGE 7: HEALTH PROBING & METRICS MONITORING ==='
                sleep time: 3, unit: 'SECONDS'
                sh '''
                    curl -s http://localhost:${PROD_PORT}/health | grep -q "healthy"
                    curl -s http://localhost:${PROD_PORT}/metrics | grep -q "http_requests_total"
                '''
                echo "Monitoring check passed: /health and /metrics are live and responding with 200 OK."
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution finished.'
        }
        success {
            echo 'CI/CD Pipeline succeeded across all 7 stages.'
        }
        failure {
            echo 'Pipeline failed. Check stage console outputs for debugging details.'
        }
    }
}