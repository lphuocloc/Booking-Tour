const ADMIN_USER = { username: 'admin', password: '123456' };

exports.loginForm = (req, res) => {
  res.render('auth/login', { error: null, session: req.session });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
    req.session.user = { username };
    return res.redirect('/admin');
  }
  res.render('auth/login', { error: 'Invalid credentials', session: req.session });
};

exports.logout = (req, res) => {
  req.session.toast = { type: 'success', message: 'Đăng xuất thành công!' };
  req.session.destroy(() => {
    // Khi session bị destroy, toast sẽ mất, nên cần truyền qua cookie hoặc query, nhưng ở đây sẽ chuyển hướng kèm query
    res.redirect('/tours?logout=1');
  });
};
