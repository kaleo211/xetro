import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { Text } from '@fluentui/react/lib/Text';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { Breadcrumb, IBreadcrumbItem } from '@fluentui/react/lib/Breadcrumb';
import { Link, Icon } from '@fluentui/react';

import { joinOrCreateBoard } from '../store/board/action';
import ToolBar from './ToolBar';
import { BoardI, GroupI, UserI } from '../../types/models';
import { ApplicationState } from '../store/types';
import { Keyable } from '../../types/common';

const classNames = mergeStyleSets({
  root: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginLeft: 32,
  },
  bread: {
    display: 'flex',
    flexGrow: 4,
    flexDirection: 'column',
  },
  profile: {
    flexGrow: 2,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 24,
    marginTop: 8,
  },
  text: {
    color: '#222222',
  },
  underline: {
    textDecoration: 'underline',
  },
  divider: {
    marginLeft: 12,
    marginRight: 12,
    color: '#222222',
  },
});


interface PropsI extends RouteComponentProps {
  group: GroupI;
  board: BoardI;
  me: UserI;

  joinOrCreateBoard(): Promise<void>;
}

interface StateI { }

class Menu extends React.Component<PropsI, StateI> {
  constructor(props: any) {
    super(props);
    this.state = { };
  }

  async onJoinOrCreateBoard() {
    await this.props.joinOrCreateBoard();
    this.props.history.push('/board');
  }

  onRenderItem(item:Keyable) {
    return <>
      <Link onClick={item.onClick}>
        <Text
            // className={classNames(classNames.text, { [classNames.underline]: item.key == this.props.page })}
            variant="xLarge"
        >
          {item.text}
        </Text>
      </Link>
    </>;
  }

  render() {
    const { group, history, me } = this.props;

    const bread: IBreadcrumbItem[] = [{ text: 'Xetro', key: 'home', onClick: () => history.push('/') }];
    if (group) {
      bread.push({ text: group.name, key: 'group', onClick: () => history.push('/group') });
      bread.push({ text: 'Board', key: 'board', onClick: this.onJoinOrCreateBoard.bind(this) });
    }

    return (
      <div className={classNames.root}>
        <div className={classNames.bread}>
          <Breadcrumb
              items={bread}
              maxDisplayedItems={10}
              onRenderItem={this.onRenderItem.bind(this)}
              dividerAs={() => <Icon iconName="ChevronRightSmall" className={classNames.divider} />}
          />
          <ToolBar />
        </div>
        <div className={classNames.profile}>
          <Text className={classNames.text} variant="xLarge">{me.firstName}</Text>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: ApplicationState) => ({
  group: state.group.group,
  board: state.board.board,
  me: state.user.me,
});
const mapDispatchToProps = { joinOrCreateBoard };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(withRouter(Menu));
