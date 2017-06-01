describe('EventFull login page', function() {
  it('should error with incorrect login', function() {
    browser.get('http://localhost:3000/login');

    element(by.model('lc.userCredentials.userEmail')).sendKeys('test@test.com');
    element(by.model('lc.userCredentials.password')).sendKeys('notarealpassword');
    element(by.css('[ng-click="lc.login()"]')).click();
    var message = element(by.css('.alert-message'));
    expect(message.getText()).toEqual('Internal server error! Pleae try again later' || 'Incorrect Email or password');
  });
  it('should error with non-valid email type', function() {
    browser.get('http://localhost:3000/login');
    element(by.model('lc.userCredentials.userEmail')).sendKeys('test');
    element(by.model('lc.userCredentials.password')).sendKeys('notarealpassword');
    element(by.css('[ng-click="lc.login()"]')).click();
    var message = element(by.css('.alert-message'));
    expect(message.getText()).toEqual('Please enter a valid Email address');

    browser.get('http://localhost:3000/login');
    element(by.model('lc.userCredentials.userEmail')).sendKeys('test@test');
    element(by.model('lc.userCredentials.password')).sendKeys('notarealpassword');
    element(by.css('[ng-click="lc.login()"]')).click();
    message = element(by.css('.alert-message'));
    expect(message.getText()).toEqual('Please enter a valid Email address');

    browser.get('http://localhost:3000/login');
    element(by.model('lc.userCredentials.userEmail')).sendKeys('testtest.com');
    element(by.model('lc.userCredentials.password')).sendKeys('notarealpassword');
    element(by.css('[ng-click="lc.login()"]')).click();
    message = element(by.css('.alert-message'));
    expect(message.getText()).toEqual('Please enter a valid Email address');
  });
  it('should error with missing email', function() {
    browser.get('http://localhost:3000/login');
    element(by.model('lc.userCredentials.userEmail')).sendKeys('');
    element(by.model('lc.userCredentials.password')).sendKeys('notarealpassword');
    element(by.css('[ng-click="lc.login()"]')).click();
    var message = element(by.css('.alert-message'));
    expect(message.getText()).toEqual('Please enter your Email address and password');
  });
  it('should error with missing password', function() {
    browser.get('http://localhost:3000/login');
    element(by.model('lc.userCredentials.userEmail')).sendKeys('test@test.com');
    element(by.model('lc.userCredentials.password')).sendKeys('');
    element(by.css('[ng-click="lc.login()"]')).click();
    var message = element(by.css('.alert-message'));
    expect(message.getText()).toEqual('Please enter your Email address and password');
  });
});
