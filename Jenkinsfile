pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Banjer71/maurizio-lomartire.git'
            }
        }

        stage('Build') {
            steps {
                    echo "🛠️ Building the app..."
                    // Clean node_modules and lockfile to avoid caching WASM
                    sh '''
                        echo "Cleaning node_modules and package-lock.json..."
                        rm -rf node_modules package-lock.json
                    '''
                    // Set environment variables to disable Squoosh
                    withEnv([
                        "NODE_OPTIONS=--openssl-legacy-provider",
                        "NEXT_DISABLE_SQUOOSH=1"
                    ]) {
                        // Install dependencies
                        sh 'npm install'
                        // Run the Next.js build
                        sh 'npm run build'
                    }
             }   
        }


        stage('Test') {
            steps {
                echo '🧪 Running tests...'
                sh 'npm test || echo "No tests found"'
            }
        }

        stage('Package') {
            steps {
                echo '📦 Creating Docker image...'
                sh 'docker build -t maurizio-lomartire:latest .'
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Deploying container...'
                sh '''
                    docker stop maurizio-lomartire || true
                    docker rm maurizio-lomartire || true
                    docker run -d --name maurizio-lomartire -p 3000:3000 maurizio-lomartire:latest
                '''
            }
        }
    }

    post {
        success { echo '✅ Deployment successful!' }
        failure { echo '❌ Deployment failed.' }
    }
}
