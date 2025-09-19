import React, { useEffect } from 'react';
import { useAppStore } from './store/appStore';

import LoadingSpinner from './components/LoadingSpinner';
import LoginView from './components/LoginView';
import AdminDashboard from './components/AdminDashboard';
import Dashboard from './components/Dashboard';

import { View } from './types';
import Sidebar from './components/Sidebar';
import CourseIntroView from './components/CourseIntroView';
import CourseView from './components/CourseView';
import QuizView from './components/QuizView';
import { FlashcardView } from './components/FlashcardView';
import FinalProjectView from './components/FinalProjectView';
import CertificateView from './components/CertificateView';
import TutorView from './components/TutorView';
import ExamView from './components/ExamView';
import ProfileView from './components/ProfileView';
import GalleryView from './components/GalleryView';
import KnowledgeBaseView from './components/KnowledgeBaseView';
import ModuleExpansionModal from './components/ModuleExpansionModal';
import StudyToolsModal from './components/StudyToolsModal';
import DeeperExplanationModal from './components/DeeperExplanationModal';
import DiscussionPanelView from './components/DiscussionPanelView';
import RemedialLessonModal from './components/RemedialLessonModal';
import ToastContainer from './components/ToastContainer';

const App: React.FC = () => {
  const { isInitialized, appState, initializeApp, toasts } = useAppStore(state => ({
    isInitialized: state.isInitialized,
    appState: state.appState,
    initializeApp: state.initializeApp,
    toasts: state.toasts,
  }));

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  if (!isInitialized || !appState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <LoadingSpinner message="Inicializando TELNET ACADEMY..." />
      </div>
    );
  }

  const renderContent = () => {
    switch (appState.view) {
      case 'login':
        return <LoginView />;
      case 'admin':
        return <AdminDashboard />;
      case 'employee':
        return <EmployeeContainer />;
      default:
        return <LoginView />;
    }
  };

  return (
    <div className="h-screen w-screen">
        {renderContent()}
        <ToastContainer toasts={toasts} />
    </div>
  );
};

const EmployeeContainer: React.FC = () => {
    const { 
      activeCourseId, 
      activeView, 
      activeEmployee, 
      logout
    } = useAppStore(state => ({
        activeCourseId: state.activeCourseId,
        activeView: state.activeView,
        activeEmployee: state.getters.activeEmployee(),
        logout: state.logout,
    }));

    useEffect(() => {
        if (!activeEmployee) {
            logout();
        }
    }, [activeEmployee, logout]);

    if (!activeEmployee) {
      return null;
    }
    
    if (activeCourseId) {
        return <CourseContainer />;
    }
    
    switch (activeView) {
        case View.PROFILE:
            return <ProfileView />;
        case View.GALLERY:
            return <GalleryView />;
        case View.KNOWLEDGE_BASE:
            return <KnowledgeBaseView />;
        default:
            return <Dashboard />;
    }
};

const CourseContainer: React.FC = () => {
    const {
        activeView,
        activeCourse,
        activeEmployee,
        returnToDashboard,
        // Modals & Panels State/Actions
        expansionState, closeExpansionModal, selectExpansionSuggestion,
        studyToolsState, closeStudyTools, selectStudyToolType, generateTopology, sendInterviewMessage, simulateSandboxCommand, resetStudyTool,
        explanationState, closeExplanationModal,
        discussionPanelState, closeDiscussionPanel, createForumPost, createForumReply, generateForumSummary,
        remedialLessonState,
    } = useAppStore(state => ({
        activeView: state.activeView,
        activeCourse: state.getters.activeCourse(),
        activeEmployee: state.getters.activeEmployee(),
        returnToDashboard: state.returnToDashboard,
        // Modals & Panels
        expansionState: state.expansionState,
        closeExpansionModal: state.closeExpansionModal,
        selectExpansionSuggestion: state.selectExpansionSuggestion,
        studyToolsState: state.studyToolsState,
        closeStudyTools: state.closeStudyTools,
        selectStudyToolType: state.selectStudyToolType,
        generateTopology: state.generateTopology,
        sendInterviewMessage: state.sendInterviewMessage,
        simulateSandboxCommand: state.simulateSandboxCommand,
        resetStudyTool: state.resetStudyTool,
        explanationState: state.explanationState,
        closeExplanationModal: state.closeExplanationModal,
        discussionPanelState: state.discussionPanelState,
        closeDiscussionPanel: state.closeDiscussionPanel,
        createForumPost: state.createForumPost,
        createForumReply: state.createForumReply,
        generateForumSummary: state.generateForumSummary,
        remedialLessonState: state.remedialLessonState,
    }));

    useEffect(() => {
        if (!activeCourse || !activeEmployee) {
            returnToDashboard();
        }
    }, [activeCourse, activeEmployee, returnToDashboard]);

    if (!activeCourse || !activeEmployee) {
        return null; 
    }
    
    const lessonKey = `m${useAppStore.getState().activeModuleIndex}_l${useAppStore.getState().activeLessonIndex}`;
    const forumPosts = activeCourse.progress.forums?.[lessonKey] || [];

    const renderCourseView = () => {
        switch(activeView) {
            case View.COURSE_INTRO: return <CourseIntroView />;
            case View.LESSON: return <CourseView />;
            case View.QUIZ: return <QuizView />;
            case View.FLASHCARDS: return <FlashcardView />;
            case View.FINAL_PROJECT: return <FinalProjectView />;
            case View.CERTIFICATE: return <CertificateView />;
            case View.TUTOR: return <TutorView />;
            case View.EXAM: return <ExamView />;
            default: return <CourseView />;
        }
    }
    
    return (
        <div className="flex h-screen bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-slate-300 overflow-hidden">
            <Sidebar />
            <main className="flex-grow flex flex-col h-full overflow-hidden relative">
                {renderCourseView()}

                {/* Modals & Panels */}
                {(expansionState.moduleIndex !== null) && (
                    <ModuleExpansionModal 
                        state={expansionState}
                        onClose={closeExpansionModal}
                        onSelectSuggestion={selectExpansionSuggestion}
                    />
                )}
                {studyToolsState.isOpen && (
                    <StudyToolsModal
                        state={studyToolsState}
                        onClose={closeStudyTools}
                        onSelectToolType={selectStudyToolType}
                        onGenerateTopology={generateTopology}
                        onSendInterviewMessage={sendInterviewMessage}
                        onSimulateSandboxCommand={simulateSandboxCommand}
                        onReset={resetStudyTool}
                        courseContext={activeCourse.course.title}
                    />
                )}
                 <DeeperExplanationModal
                    isOpen={explanationState.isOpen}
                    onClose={closeExplanationModal}
                    title={explanationState.lessonTitle}
                    content={explanationState.content}
                    isLoading={explanationState.isLoading}
                    error={explanationState.error}
                    courseContext={activeCourse.course.title}
                />
                 <DiscussionPanelView
                    isOpen={discussionPanelState.isOpen}
                    onClose={closeDiscussionPanel}
                    lessonTitle={activeCourse.course.modules[useAppStore.getState().activeModuleIndex]?.lessons[useAppStore.getState().activeLessonIndex]?.lessonTitle || ''}
                    forumPosts={forumPosts}
                    currentUser={activeEmployee}
                    onCreatePost={createForumPost}
                    onCreateReply={createForumReply}
                    onGenerateSummary={generateForumSummary}
                    summaryState={{
                        summary: discussionPanelState.summary,
                        isLoading: discussionPanelState.isLoadingSummary,
                        error: discussionPanelState.error
                    }}
                />
                <RemedialLessonModal
                    state={remedialLessonState}
                    onClose={() => useAppStore.setState({ remedialLessonState: { ...remedialLessonState, isOpen: false }})}
                    courseContext={activeCourse.course.title}
                />
            </main>
        </div>
    )
}


export default App;
