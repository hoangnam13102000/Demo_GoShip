import { BrowserRouter, Route, Routes } from 'react-router-dom';

const App = () => {
	return (
		<>
			<BrowserRouter>
				<Routes>
					{/* Main page routes */}
					<Route path='/'>
						{/* Protected routes: User */}
						<Route path='profile'></Route>
					</Route>

					{/* Protected routes: Admin */}
					<Route path='admin'></Route>
				</Routes>
			</BrowserRouter>
		</>
	);
};

export default App;
