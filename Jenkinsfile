
pipeline {

    agent any

    options {
        timestamps()
    }

    stages {

        // Stage 1: Get code from GitHub
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // Stage 2: Install project dependencies
        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        // Stage 3: Execute WebdriverIO tests
        stage('Run WebdriverIO Tests') {
       
    steps {
        bat '''
            npx wdio run ./wdio.conf.js --spec ./features/pageContent.feature

            if not exist "allure-results" (
                echo ERROR: Allure results directory was not created.
                exit /b 1
            )

            dir /b "allure-results\\*.json" >nul 2>&1

            if errorlevel 1 (
                echo ERROR: No Allure test result files were created.
                exit /b 1
            )
        '''
    }

        }

        // Stage 4: Generate Allure report
        stage('Generate Allure Report') {
            steps {
                bat 'npx allure generate allure-results --clean -o allure-report'
            }
        }
    }

    // Execute these actions regardless of test success or failure
    post {
        always {

            // Save Allure results and report in Jenkins
            archiveArtifacts(
                artifacts: 'allure-results/**, allure-report/**',
                allowEmptyArchive: true
            )

        }

        success {
            echo 'WebdriverIO automation execution completed successfully!'
        }

        failure {
            echo 'WebdriverIO automation execution failed. Check the console output.'
        }
    }
}
