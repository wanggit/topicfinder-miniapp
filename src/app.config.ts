export default {
  pages: [
    'pages/dashboard/index',
    'pages/learning/index',
    'pages/learning/answer',
    'pages/report/index',
    'pages/wrong/index',
    'pages/leaderboard/index',
    'pages/profile/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#764ba2',
    navigationBarTitleText: '题探',
    navigationBarTextStyle: 'white',
  },
  tabBar: {
    color: '#999',
    selectedColor: '#764ba2',
    backgroundColor: '#fff',
    list: [
      { pagePath: 'pages/dashboard/index', text: '学习', iconPath: 'assets/tab-dashboard.png', selectedIconPath: 'assets/tab-dashboard-active.png' },
      { pagePath: 'pages/learning/index', text: '选题', iconPath: 'assets/tab-learning.png', selectedIconPath: 'assets/tab-learning-active.png' },
      { pagePath: 'pages/report/index', text: '报告', iconPath: 'assets/tab-report.png', selectedIconPath: 'assets/tab-report-active.png' },
      { pagePath: 'pages/wrong/index', text: '错题', iconPath: 'assets/tab-wrong.png', selectedIconPath: 'assets/tab-wrong-active.png' },
      { pagePath: 'pages/profile/index', text: '我的', iconPath: 'assets/tab-profile.png', selectedIconPath: 'assets/tab-profile-active.png' },
    ],
  },
}
