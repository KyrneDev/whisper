import Component from 'flarum/common/Component';
import avatar from 'flarum/common/helpers/avatar';
import username from 'flarum/common/helpers/username';
import userOnline from 'flarum/common/helpers/userOnline';
import app from 'flarum/forum/app';

export default class UserListItem extends Component {
  oninit(vnode) {
    this.conversation = vnode.attrs.conversation;
    this.index = vnode.attrs.i;
    this.active = vnode.attrs.active;
    this.loading = true;

    this.conversation.recipients().map((recipient) => {
      if (parseInt(recipient.user().id()) !== parseInt(app.session.user.id())) {
        this.user = recipient.user();
        this.loading = false;
        m.redraw();
      }
    });

    const interval2 = () => {
      if (this.typingTime < new Date(Date.now() - 6000)) {
        this.typing = false;
        m.redraw();
      }
      setTimeout(() => {
        interval2();
      }, 6000);
    };

    interval2();

    super.oncreate(vnode);
  }

  onremove(vnode) {
    if (app.pusher) {
      app.pusher.then((object) => {
        const channels = object.channels;
        channels.user.unbind('typing');
      });
    }

    super.onremove(vnode);
  }

  oncreate(vnode) {
    if (app.pusher) {
      app.pusher.then((object) => {
        const channels = object.channels;
        channels.user.bind('typing', (data) => {
          if (parseInt(data.conversationId) === parseInt(this.conversation.id())) {
            this.typing = true;
            this.typingTime = new Date();
            m.redraw();
          }
        });
      });
    }

    super.oncreate(vnode);
  }

  view(vnode) {
    if (this.loading || !this.user) return null;

    const onclick = (e) => {
      this.attrs.onclick(e);
      this.active = this.conversation.id() === app.cache.conversations[$(e.currentTarget).attr('id')].id();
    };

    return (
      <li id={this.index} className={this.active ? 'UserListItem active' : 'UserListItem'} onclick={onclick}>
        <div className="UserListItem-content">
          {avatar(this.user)}
          <div className="info">
            {username(this.user)}
            {userOnline(this.user)}
          </div>
          {!!this.typing && (
            <div className="tiblock">
              <div className="tidot"></div>
            </div>
          )}
        </div>
      </li>
    );
  }
}
