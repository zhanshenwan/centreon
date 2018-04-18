stage('Test') {
  echo "begin"
  echo env.BRANCH_NAME
  if (env.BRANCH_NAME =~ /^\.+\$/) {
    echo "toto"
    echo "*FAILURE*: `CENTREON WEB` <${env.BUILD_URL}|build #${env.BUILD_NUMBER}> on branch ${env.BRANCH_NAME}\n" +
            "*COMMIT*: <https://github.com/centreon/centreon/commit/${source.COMMIT}|here> by ${source.COMMITTER}\n" +
            "*INFO*: ${e}"
  }
}
