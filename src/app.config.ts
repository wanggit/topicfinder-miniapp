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
      { pagePath: 'pages/dashboard/index', text: '学习' },
      { pagePath: 'pages/learning/index', text: '选题' },
      { pagePath: 'pages/report/index', text: '报告' },
      { pagePath: 'pages/wrong/index', text: '错题' },
      { pagePath: 'pages/leaderboard/index', text: '排行' },
      { pagePath: 'pages/profile/index', text: '我的' },
    ],
  },
}
