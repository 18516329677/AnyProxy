/*
* A copoment for the request log table
*/

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Table } from 'antd';
import { formatDate } from 'common/commonUtil';

import Style from './table-panel.less';
import ClassBind from 'classnames/bind';
import CommonStyle from '../style/common.less';

const StyleBind = ClassBind.bind(Style);

class TablePanel extends React.Component {
    constructor () {
        super();
        this.state = {
            active: true
        };
    }
    static propTypes = {
        data: PropTypes.array
    }

    getTr () {

    }
    render () {
        const httpsIcon = <i className="fa fa-lock" />;
        const columns = [
            {
                title: 'Host',
                width: 200,
                dataIndex: 'host'
            },
            {
                title: 'Path',
                dataIndex: 'path'
            },
            {
                title: 'Start',
                width: 100,
                dataIndex: 'startTime',
                render (text) {
                    const timeStr = formatDate(text, 'hh:mm:ss');
                    return <span>{timeStr}</span>;
                }
            }
        ];

        function rowClassFunc (record, index) {
            return StyleBind('row', { 'lightBackgroundColor': index % 2 === 1 });
        }

        return (
            <div className={Style.tableWrapper} >
                <Table
                    columns={columns}
                    dataSource={this.props.data || []}
                    pagination={false}
                    rowKey="id"
                    rowClassName={rowClassFunc}
                />
            </div>
        );
    }
}

export default TablePanel;