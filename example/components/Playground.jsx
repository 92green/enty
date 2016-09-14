
var React = require('react');
import {entityQuery} from '../actions';

var Playground = React.createClass({
    displayName: 'Playground',
    render() {
        var {subreddit} = this.props;
        return <pre>{JSON.stringify(subreddit && subreddit.toJS(), null, 4)}</pre>;
    }
});

export default entityQuery(props => `{
    subreddit(name: "MechanicalKeyboards") {
        name
        fullnameId
        topListings {
            fullnameId
            title
            author {
                fullnameId
                username
                created
                linkKarma
                commentKarma
            }
        }
      }
    }
`)(Playground);
