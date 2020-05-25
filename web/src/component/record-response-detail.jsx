/**
 * The panel to display the response detial of the record
 *
 */

import React, { PropTypes } from 'react';
import ClassBind from 'classnames/bind';
import { Menu, Table, notification, Spin, Button, message } from 'antd';
import JsonViewer from 'component/json-viewer';
import ModalPanel from 'component/modal-panel';

import Style from './record-detail.less';
import CommonStyle from '../style/common.less';
import { postJSON } from 'common/apiUtil';

const StyleBind = ClassBind.bind(Style);
const PageIndexMap = {
  REQUEST_INDEX: 'REQUEST_INDEX',
  RESPONSE_INDEX: 'RESPONSE_INDEX'
};

// the maximum length of the request body to decide whether to offer a download link for the request body
const MAXIMUM_REQ_BODY_LENGTH = 10000;

class RecordResponseDetail extends React.Component {
  constructor() {
    super();
    this.state = {

    };

  }

  static propTypes = {
    recordDetail: PropTypes.object
  }

  onSelectText(e) {
    selectText(e.target);
  }

  getLiDivs(targetObj) {
    const liDom = Object.keys(targetObj).map((key) => {
      return (
        <li key={key} className={Style.liItem} >
          <strong>{key} : </strong>
          <span>{targetObj[key]}</span>
        </li>
      );
    });

    return liDom;
  }

  saveResponse(recordDetail) {

    var request = {};
    console.log("record detail is" + recordDetail.path);
    if (recordDetail.url.indexOf("?") !== -1) {
      var url = recordDetail.path.split("?");
      request.path = url[0];
      request.query = url[1];
    } else {
      request.path = recordDetail.path;
    }
    // if (recordDetail.body !== undefined) {
    //   request.body = recordDetail.body
    // }
    request.method = recordDetail.method;

    const statusCode = recordDetail.statusCode;
    const header = recordDetail.resHeader;
    var response = {};
    var resbody = recordDetail.resBody;
    response.status = statusCode;
    response.headers = header;
    if (resbody !== undefined && resbody !== "") {
      response.body = JSON.parse(resbody);
    }
    var mockdata = {};
    mockdata.request = request;
    mockdata.response = response;
    mockdata.mock = false;
    mockdata.wait = 0;

    postJSON('/savemockdata', mockdata)
      .then((result) => {
        message.info('Save mockdata success');
      })
      .catch((error) => {
        message.error('Failed to save mockdata');
      });
    console.log(mockdata);
  }

  getImageBody(recordDetail) {
    return <img src={recordDetail.ref} className={Style.imageBody} />;
  }

  getJsonBody(recordDetail) {
    return <JsonViewer data={recordDetail.resBody} />;
  }

  getResBodyDiv() {
    const { recordDetail } = this.props;

    const self = this;

    let reqBodyDiv = <div className={Style.codeWrapper}> <pre>{recordDetail.resBody} </pre></div>;

    switch (recordDetail.type) {
      case 'image': {
        reqBodyDiv = <div > {self.getImageBody(recordDetail)} </div>;
        break;
      }
      case 'json': {
        reqBodyDiv = self.getJsonBody(recordDetail);
        break;
      }

      default: {
        if (!recordDetail.resBody && recordDetail.ref) {
          reqBodyDiv = <a href={recordDetail.ref} target="_blank">{recordDetail.fileName}</a>;
        }
        break;
      }
    }

    return (
      <div className={Style.resBody} >
        {reqBodyDiv}
      </div>
    );
  }

  getResponseDiv(recordDetail) {
    const statusStyle = StyleBind({ okStatus: recordDetail.statusCode === 200 });

    return (
      <div>
        <div className={Style.section} >
          <div>
            <span className={CommonStyle.sectionTitle}>Mock</span>
          </div>
          <div className={CommonStyle.whiteSpace10} />
          <div>
            <Button type="dashed" onClick={this.saveResponse.bind(this, recordDetail)}>Save</Button>
            <Button type="dashed">Edit</Button>
          </div>
        </div>
        <div className={Style.section} >
          <div>
            <span className={CommonStyle.sectionTitle}>General</span>
          </div>
          <div className={CommonStyle.whiteSpace10} />
          <ul className={Style.ulItem} >
            <li className={Style.liItem} >
              <strong>Status Code:</strong>
              <span className={statusStyle} > {recordDetail.statusCode} </span>
            </li>
          </ul>
        </div>
        <div className={Style.section} >
          <div>
            <span className={CommonStyle.sectionTitle}>Header</span>
          </div>
          <div className={CommonStyle.whiteSpace10} />
          <ul className={Style.ulItem} >
            {this.getLiDivs(recordDetail.resHeader)}
          </ul>
        </div>
        <div className={Style.section} >
          <div>
            <span className={CommonStyle.sectionTitle}>Body</span>
          </div>
          <div className={CommonStyle.whiteSpace10} />
          {this.getResBodyDiv()}
        </div>
      </div>
    );
  }

  render() {
    return this.getResponseDiv(this.props.recordDetail);
  }
}

export default RecordResponseDetail;
