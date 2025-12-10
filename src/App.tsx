import { useEffect } from 'react';
import { useStore } from './state/useStore';
import { Home } from './pages/Home';
import { Processing } from './pages/Processing';
import { Review } from './pages/Review';
import { Final } from './pages/Final';

function App() {
  const currentPage = useStore(state => state.currentPage);
  const setCurrentPage = useStore(state => state.setCurrentPage);
  const setStatus = useStore(state => state.setStatus);
  const reset = useStore(state => state.reset);

  useEffect(() => {
    document.title = 'Cerina Protocol Foundry';
  }, []);

  const handleStart = () => {
    setStatus('drafting');
    setCurrentPage('processing');
  };

  const handleProcessingComplete = () => {
    setCurrentPage('review');
  };

  const handleApprove = () => {
    setCurrentPage('final');
  };

  const handleRevise = () => {
    setCurrentPage('processing');
  };

  const handleRestart = () => {
    reset();
    setCurrentPage('home');
  };

  return (
    <>
      {currentPage === 'home' && <Home onStart={handleStart} />}
      {currentPage === 'processing' && <Processing onComplete={handleProcessingComplete} />}
      {currentPage === 'review' && <Review onApprove={handleApprove} onRevise={handleRevise} />}
      {currentPage === 'final' && <Final onRestart={handleRestart} />}
    </>
  );
}

export default App;
