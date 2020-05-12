import React from 'react';
import './base.css';

export class Component extends React.PureComponent {
  componentWillMount() { }

  componentDidMount() { }

  getTimeLeft(trendInfo) {
    if (trendInfo) {
      let endLeft = this.getLastTime((trendInfo.startTime + trendInfo.timeSpan) - trendInfo.chainEndTime);
      let buyLeft = this.getLastTime((trendInfo.startTime + trendInfo.timeSpan - trendInfo.stopBefore) - trendInfo.chainEndTime);
      let nextStart = endLeft;
      let timeNextEnd = (new Date((trendInfo.startTime + trendInfo.timeSpan*2 - trendInfo.stopBefore)*1000)).toString().split(' ');
      let nextEnd = ' ' + timeNextEnd[1] + ' ' + timeNextEnd[2] + ' ' + timeNextEnd[4].substr(0, 5) + ' ' + timeNextEnd[5];
      return { endLeft, buyLeft, nextStart, nextEnd };
    }

    return { endLeft: { h: '0', m: '0', s: '0' }, buyLeft: { h: '0', m: '0', s: '0' } };
  }

  getLastTime(leftTimeSecond) {
    if (leftTimeSecond < 0) {
      return { h: '0', m: '0', s: '0' }
    }

    let h = Math.floor(leftTimeSecond / 3600);
    let m = Math.floor(leftTimeSecond % 3600 / 60);
    let s = Math.floor(leftTimeSecond % 60);
    return { h, m, s }
  }

  getLastTimeDH(leftTimeSecond) {
    if (leftTimeSecond < 0) {
      return { d: '0', h: '0' }
    }

    let d = Math.floor(leftTimeSecond / (3600 * 24));
    let h = Math.floor(leftTimeSecond % (3600 * 24) / 60 / 60);
    return { d, h }
  }
}
