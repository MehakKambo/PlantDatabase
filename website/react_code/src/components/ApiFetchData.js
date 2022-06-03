import React from "react";


export default class ApiFetchData extends React.Component {

    state = {
        loading: true
    }

    async componentDidMount(){
        const url = "https://plantdb.azurewebsites.net/plants";
        const response = await fetch(url);
        const data = await response.json();
        console.log(data.plants[1].commonName);
    }

    render() {
        return <div>
            {this.state.loading ? <div>Data</div> : <div>More data</div>}
        </div>;
    }


}

