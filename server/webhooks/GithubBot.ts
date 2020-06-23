import Bot from "./BotSDK";

class GithubBot extends Bot {
  constructor(props) {
    super(props);

    this.actions = {
      'created': this.created.bind(this),
      'opened': this.opened.bind(this)
    }
  }

  async created(payload) {
    if (payload.comment) {
      await this.onIssueComment(payload);
    }
  }

  async opened(payload) {
    if (payload.issue) {
      await this.onIssue(payload);
    }
    if (payload.pull_request) {
      await this.onPullRequest(payload);
    }
  }

  async onIssue(payload) {
    let user = `[${payload.issue.user.login}](${payload.issue.user.login})`
    await this.sendMessage(`
    \r${user} opened a new issue.

    \r"[${payload.issue.title}](${payload.issue.html_url})"
  `)
  }

  async onPullRequest(payload) {
    let user = `[${payload.pull_request.user.login}](${payload.pull_request.user.login})`
    await this.sendMessage(`
    \r${user} opened a new pull request.

    \r"[${payload.pull_request.title}](${payload.pull_request.html_url})"
  `)
  }

  async onIssueComment(payload) {
    let user = `[${payload.issue.user.login}](${payload.issue.user.login})`
    await this.sendMessage(`
    \r${user} commented on "[${payload.issue.title}](${payload.issue.html_url})"

    \r${payload.comment.body}
  `)
  }
}

export default GithubBot;