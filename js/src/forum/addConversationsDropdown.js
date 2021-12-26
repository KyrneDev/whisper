import { extend } from 'flarum/common/extend';
import app from 'flarum/forum/app';
import HeaderSecondary from 'flarum/forum/components/HeaderSecondary';
import ConversationsDropdown from './components/ConversationsDropdown';

export default function () {
  extend(HeaderSecondary.prototype, 'items', function (items) {
    if (app.forum.attribute('canMessage') || (app.session.user && app.session.user.conversations().length)) {
      items.add('Messages', <ConversationsDropdown />, 20);
    }
  });
}
