// @flow
import React from 'react';
import {
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
/* eslint-disable import/no-unresolved, import/extensions */
import Textfield from './Textfield';
/* eslint-enable import/no-unresolved, import/extensions*/

type Props = {
  children?: React.Element<any>,
  headerText: string,
  meta: Object,
  onCollapse: () => void,
  onExpand: () => void,
}

export interface Collapsible {
  collapse: () => void,
  expand: () => void,
}

export default class CollapsibleField extends React.Component implements Collapsible {
  static defaultProps = {
    children: undefined,
    onCollapse: () => { },
    onExpand: () => { },
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      collapsibleHeight: new Animated.Value(0),
    };
    this._collapsed = true;
    this._childrenHeight = 0;
  }

  state: {
    collapsibleHeight: Animated.Value,
  };

  collapse = () => {
    this._animateCollapsibleHeight(0);
    this._collapsed = true;
  };

  expand = () => {
    this._animateCollapsibleHeight(this._childrenHeight);
    this._collapsed = false;
  };

  _animateCollapsibleHeight = (toValue: number) => {
    Animated.timing(
      this.state.collapsibleHeight,
      {
        toValue,
        duration: 220,
      },
    ).start();
  };

  _toggle = () => {
    const { onCollapse, onExpand } = this.props;
    if (this._collapsed) {
      this.expand();
      onExpand();
    } else {
      this.collapse();
      onCollapse();
    }
  };

  _setChildrenHeight = (event: Object) => {
    this._childrenHeight = event.nativeEvent.layout.height;
  };

  _collapsed: boolean;
  _childrenHeight: number;
  props: Props;

  render() {
    const { children, headerText, meta, ...rest } = this.props;
    // uses Textfield to have same look as other fields in forms
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this._toggle}>
          <View>
            <Textfield
              editable={false}
              meta={meta}
              value={headerText}
              {...rest}
            />
          </View>
        </TouchableWithoutFeedback>
        <Animated.View style={[styles.container, { height: this.state.collapsibleHeight }]}>
          <View onLayout={this._setChildrenHeight} style={styles.childrenContainer}>
            {children}
          </View>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  childrenContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
});