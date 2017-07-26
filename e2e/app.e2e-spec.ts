import { AlarmMadnessPage } from './app.po';

describe('alarm-madness App', () => {
  let page: AlarmMadnessPage;

  beforeEach(() => {
    page = new AlarmMadnessPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
