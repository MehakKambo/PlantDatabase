import {Link} from 'react-router-dom';
import classes from './MainNavigation.module.css';

function MainNavigation() {
    return (
        <header>
            <nav>
                <ul>
                    <li>
                        <Link to='/'>Front Page</Link>
                    </li>
                    <li>
                        <Link to='/conditions-page'>Conditions Page</Link>
                    </li>
                    <li>
                        <Link to='/symptoms-page'>Symptoms Page</Link>
                    </li>
                    
                </ul>
            </nav>
        </header>
    )

}

export default MainNavigation;



