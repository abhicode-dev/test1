pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    parameters {
        choice(
            name: 'BRANCH_NAME',
            choices: [
                'feature/jenkins-script-selection',
                'developer',
                'developerbranch',
                'main',
                'testingnew'
            ],
            description: 'Select the GitHub branch to build'
        )
    }

    stages {
        stage('Checkout Selected Branch') {
            steps {
                echo "Selected branch: ${params.BRANCH_NAME}"

                checkout([
                    $class: 'GitSCM',
                    branches: [[name: "*/${params.BRANCH_NAME}"]],
                    userRemoteConfigs: [[
                        url: 'https://github.com/abhicode-dev/test1.git'
                    ]]
                ])
            }
        }

        stage('Check Environment') {
            steps {
                dir('my-app') {
                    bat 'node --version'
                    bat 'npm --version'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('my-app') {
                   bat 'if exist node_modules rmdir /s /q node_modules'
            bat 'npm cache verify'
            bat 'npm install --no-audit --no-fund'
                }
            }
        }
        stage('Run React Tests') {
    steps {
        dir('my-app') {
            bat 'set CI=true&& npm test -- --watchAll=false'
        }
    }
}

        stage('Build React Application') {
            steps {
                dir('my-app') {
                    bat 'npm run build'
                }
            }
        }
    }

    post {
        success {
            echo "SUCCESS: React app built from branch ${params.BRANCH_NAME}"
        }

        failure {
            echo "FAILURE: Check the stage logs for errors."
        }

        always {
            echo 'Pipeline execution completed.'
        }
    }
}