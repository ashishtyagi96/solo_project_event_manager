describe('EventFull register page', function() {
  var EC = protractor.ExpectedConditions;
  it('should receive message back from server if all info correct', function() {
    browser.get('http://localhost:3000/register');

    element(by.model('rc.userCredentials.userEmail')).sendKeys('test@test.com');
    element(by.model('rc.userCredentials.password')).sendKeys('notarealpassword');
    element(by.model('rc.userCredentials.passwordRetype')).sendKeys('notarealpassword');
    element(by.css('[ng-click="rc.register()"]')).click();
    var message = element(by.css('.alert-message'));
    browser.wait(EC.textToBePresentInElement($('.alert-message'), 'Registration Failed!'), 2000);
    // expect(message.getText()).toEqual('Registration Failed!');
    // TODO change when route is setup
  });
  it('should error with non-valid email type', function() {
    browser.get('http://localhost:3000/register');
    element(by.model('rc.userCredentials.userEmail')).sendKeys('test');
    element(by.model('rc.userCredentials.password')).sendKeys('notarealpassword');
    element(by.model('rc.userCredentials.passwordRetype')).sendKeys('notarealpassword');
    element(by.css('[ng-click="rc.register()"]')).click();
    var message = element(by.css('.alert-message'));
    expect(message.getText()).toEqual('Please enter a valid Email address');

    browser.get('http://localhost:3000/register');
    element(by.model('rc.userCredentials.userEmail')).sendKeys('test@test');
    element(by.model('rc.userCredentials.password')).sendKeys('notarealpassword');
    element(by.model('rc.userCredentials.passwordRetype')).sendKeys('notarealpassword');
    element(by.css('[ng-click="rc.register()"]')).click();
    message = element(by.css('.alert-message'));
    expect(message.getText()).toEqual('Please enter a valid Email address');

    // TODO I know this test will fail, I need to research checking for multiple '@'s
    browser.get('http://localhost:3000/register');
    element(by.model('rc.userCredentials.userEmail')).sendKeys('test@test@test.com');
    element(by.model('rc.userCredentials.password')).sendKeys('notarealpassword');
    element(by.model('rc.userCredentials.passwordRetype')).sendKeys('notarealpassword');
    element(by.css('[ng-click="rc.register()"]')).click();
    message = element(by.css('.alert-message'));
    console.log('I know this test will fail. TODO Fix this');
    expect(message.getText()).toEqual('Please enter a valid Email address');

    browser.get('http://localhost:3000/register');
    element(by.model('rc.userCredentials.userEmail')).sendKeys('testtest.com');
    element(by.model('rc.userCredentials.password')).sendKeys('notarealpassword');
    element(by.model('rc.userCredentials.passwordRetype')).sendKeys('notarealpassword');
    element(by.css('[ng-click="rc.register()"]')).click();
    message = element(by.css('.alert-message'));
    expect(message.getText()).toEqual('Please enter a valid Email address');
  });
  it('should error with missing email', function() {
    browser.get('http://localhost:3000/register');
    element(by.model('rc.userCredentials.userEmail')).sendKeys('');
    element(by.model('rc.userCredentials.password')).sendKeys('notarealpassword');
    element(by.model('rc.userCredentials.passwordRetype')).sendKeys('notarealpassword');
    element(by.css('[ng-click="rc.register()"]')).click();
    var message = element(by.css('.alert-message'));
    expect(message.getText()).toEqual('Please enter your Email address and password');
  });
  it('should error with missing password', function() {
    browser.get('http://localhost:3000/register');
    element(by.model('rc.userCredentials.userEmail')).sendKeys('test@test.com');
    element(by.model('rc.userCredentials.password')).sendKeys('');
    element(by.model('rc.userCredentials.passwordRetype')).sendKeys('notarealpassword');
    element(by.css('[ng-click="rc.register()"]')).click();
    var message = element(by.css('.alert-message'));
    expect(message.getText()).toEqual('Please enter your Email address and password');
  });
  it('should error with missing password retyped', function() {
    browser.get('http://localhost:3000/register');
    element(by.model('rc.userCredentials.userEmail')).sendKeys('test@test.com');
    element(by.model('rc.userCredentials.password')).sendKeys('notarealpassword');
    element(by.model('rc.userCredentials.passwordRetype')).sendKeys('');
    element(by.css('[ng-click="rc.register()"]')).click();
    var message = element(by.css('.alert-message'));
    expect(message.getText()).toEqual('Please enter your Email address and password');
  });
  it('should error with all fields empty', function() {
    browser.get('http://localhost:3000/register');
    element(by.model('rc.userCredentials.userEmail')).sendKeys('');
    element(by.model('rc.userCredentials.password')).sendKeys('');
    element(by.model('rc.userCredentials.passwordRetype')).sendKeys('');
    element(by.css('[ng-click="rc.register()"]')).click();
    var message = element(by.css('.alert-message'));
    expect(message.getText()).toEqual('Please enter your Email address and password');
  });
});
