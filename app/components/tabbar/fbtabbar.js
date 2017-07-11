import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from 'friedensflotte/app/components/tabbar/style';


const FacebookTabBar = React.createClass({
  tabIcons: [],
  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
  },

  componentDidMount() {
    this._listener = this.props.scrollValue.addListener(this.setAnimationValue);
  },

  setAnimationValue({ value, }) {
    this.tabIcons.forEach((icon, i) => {
      const progress = Math.min(1, Math.abs(value - i))
      icon.setNativeProps({
        style: {
          color: this.iconColor(progress),
        },
      });
    });
  },

  //color between rgb(46,106,118) and rgb(255,255,255)
  iconColor(progress) {
    const red = 46 + (255 - 46) * progress;
    const green = 106 + (255 - 106) * progress;
    const blue = 118 + (255 - 118) * progress;
    return `rgb(${red}, ${green}, ${blue})`;
  },

  render() {
    return <View style={[styles.tabs, this.props.style, ]}>
      {this.props.tabs.map((tab, i) => {
        return <TouchableOpacity key={tab} onPress={() => this.props.goToPage(i)} style={styles.tab}>
          <Icon
            name={tab}
            size={30}
            color={this.props.activeTab === i ? 'rgb(46,106,118)' : 'rgb(255,255,255)'}
            ref={(icon) => { this.tabIcons[i] = icon; }}
          />
        </TouchableOpacity>;
      })}
    </View>;
  },
});
export default FacebookTabBar;