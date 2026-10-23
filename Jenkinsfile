pipeline {
    agent any

    parameters {
        choice(
            name: 'TEST_SCRIPT',
            choices: [
                'NAVIGATION_LINKS',
                'PAGE_LOAD',
                'PAGE_TITLE',
                'RECRUITMENT_CONTENT',
                'ALL'
            ],
            description: 'Choose which WebdriverIO Cucumber scenario to execute'
        )
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'webdriverio-jenkins',
                    url: 'https://github.com/abhicode-dev/test1.git'
            }
        }

        stage('Check Node.js and npm') {
            steps {
                bat 'node --version'
                bat 'npm --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Run Selected Tests') {
            steps {
                script {
                    def selectedTag

                    switch (params.TEST_SCRIPT) {
                        case 'NAVIGATION_LINKS':
                            selectedTag = '@navigation-links'
                            break
                        case 'PAGE_LOAD':
                            selectedTag = '@page-load'
                            break
                        case 'PAGE_TITLE':
                            selectedTag = '@page-title'
                            break
                        case 'RECRUITMENT_CONTENT':
                            selectedTag = '@recruitment-content'
                            break
                        case 'ALL':
                            selectedTag = 'not @none'
                            break
                        default:
                            error "Unknown TEST_SCRIPT: ${params.TEST_SCRIPT}"
                    }

                    withEnv(["TEST_TAG=${selectedTag}"]) {
                        bat 'npx wdio run wdio.conf.js --cucumberOpts.tags "%TEST_TAG%"'
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'WebdriverIO test execution finished.'
        }
    }
}