import { Navigate, Route, Routes } from 'react-router-dom'
import { APP_ROUTES } from '@constants/routes.js'
import { AuthLayout } from '@layouts/AuthLayout.jsx'
import { DashboardLayout } from '@layouts/DashboardLayout.jsx'
import { MainLayout } from '@layouts/MainLayout.jsx'
import { DashboardPage } from '@pages/DashboardPage.jsx'
import { HomePage } from '@pages/HomePage.jsx'
import { LoginPage } from '@pages/LoginPage.jsx'
import { NotFoundPage } from '@pages/NotFoundPage.jsx'
import { RegisterPage } from '@pages/RegisterPage.jsx'

export default function App() {
	return (
		<Routes>
			<Route element={<MainLayout />}>
				<Route path={APP_ROUTES.HOME} element={<HomePage />} />
			</Route>
			<Route element={<AuthLayout />}>
				<Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
				<Route path={APP_ROUTES.REGISTER} element={<RegisterPage />} />
			</Route>
			<Route element={<DashboardLayout />}>
				<Route path={APP_ROUTES.DASHBOARD} element={<DashboardPage />} />
			</Route>
			<Route path={APP_ROUTES.ROOT} element={<Navigate to={APP_ROUTES.HOME} replace />} />
			<Route path={APP_ROUTES.NOT_FOUND} element={<NotFoundPage />} />
		</Routes>
	)
}
