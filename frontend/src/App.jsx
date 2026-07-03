import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { APP_ROUTES } from '@constants/routes.js'
import { AuthLayout } from '@layouts/AuthLayout.jsx'
import { DashboardLayout } from '@layouts/DashboardLayout.jsx'
import { MainLayout } from '@layouts/MainLayout.jsx'
import { PageLoader } from '@components/feedback/PageLoader.jsx'
import { DashboardPage } from '@pages/DashboardPage.jsx'
import { HomePage } from '@pages/HomePage.jsx'
import { LoginPage } from '@pages/LoginPage.jsx'
import { RegisterPage } from '@pages/RegisterPage.jsx'
import { ForgotPasswordPage } from '@pages/ForgotPasswordPage.jsx'
import { ResetPasswordPage } from '@pages/ResetPasswordPage.jsx'
import { NotFoundPage } from '@pages/NotFoundPage.jsx'
import { useAuth } from '@providers/useAuth.js'

function RequireAuth({ children }) {
	const { isAuthenticated } = useAuth()

	if (!isAuthenticated) {
		return <Navigate to={APP_ROUTES.LOGIN} replace />
	}

	return children
}

/* Dashboard feature pages */
import { ResumeBuilderPage } from '@pages/dashboard/ResumeBuilderPage.jsx'
import { AtsAnalyzerPage } from '@pages/dashboard/AtsAnalyzerPage.jsx'
import { ResumeMatchPage } from '@pages/dashboard/ResumeMatchPage.jsx'
import { MockInterviewPage } from '@pages/dashboard/MockInterviewPage.jsx'
import { SkillGapPage } from '@pages/dashboard/SkillGapPage.jsx'
import { CareerRoadmapPage } from '@pages/dashboard/CareerRoadmapPage.jsx'
import { AiCoachPage } from '@pages/dashboard/AiCoachPage.jsx'
import { NotificationsPage } from '@pages/dashboard/NotificationsPage.jsx'

const AccountPage = lazy(() =>
	import('@pages/dashboard/AccountPage.jsx').then((m) => ({ default: m.AccountPage })),
)

export default function App() {
	return (
		<Routes>
			<Route element={<MainLayout />}>
				<Route path={APP_ROUTES.HOME} element={<HomePage />} />
			</Route>
			<Route element={<AuthLayout />}>
				<Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
				<Route path={APP_ROUTES.REGISTER} element={<RegisterPage />} />
				<Route path={APP_ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
				<Route path={APP_ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
			</Route>
			<Route element={<RequireAuth><DashboardLayout /></RequireAuth>}>
				<Route path={APP_ROUTES.DASHBOARD} element={<DashboardPage />} />
				<Route path={APP_ROUTES.RESUME_BUILDER} element={<ResumeBuilderPage />} />
				<Route path={APP_ROUTES.ATS_ANALYZER} element={<AtsAnalyzerPage />} />
				<Route path={APP_ROUTES.RESUME_MATCH} element={<ResumeMatchPage />} />
				<Route path={APP_ROUTES.MOCK_INTERVIEW} element={<MockInterviewPage />} />
				<Route path={APP_ROUTES.SKILL_GAP} element={<SkillGapPage />} />
				<Route path={APP_ROUTES.CAREER_ROADMAP} element={<CareerRoadmapPage />} />
				<Route path={APP_ROUTES.AI_COACH} element={<AiCoachPage />} />
				<Route path={APP_ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
				<Route
					path={APP_ROUTES.ACCOUNT}
					element={
						<Suspense fallback={<PageLoader />}>
							<AccountPage />
						</Suspense>
					}
				/>
				<Route path={APP_ROUTES.PROFILE} element={<Navigate to={APP_ROUTES.ACCOUNT} replace />} />
				<Route path={APP_ROUTES.SETTINGS} element={<Navigate to={`${APP_ROUTES.ACCOUNT}#appearance`} replace />} />
			</Route>
			<Route path={APP_ROUTES.ROOT} element={<Navigate to={APP_ROUTES.HOME} replace />} />
			<Route path={APP_ROUTES.NOT_FOUND} element={<NotFoundPage />} />
		</Routes>
	)
}
