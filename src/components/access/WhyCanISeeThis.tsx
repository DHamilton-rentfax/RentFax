
import { useState } from 'react';
import { Modal } from '@/components/Modal'; // Assuming a generic Modal component
import { explainAccess } from '@/lib/access/explainAccess';
import { logEvent } from '@/lib/audit/logEvent';

export function WhyCanISeeThis({ viewer, target }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = async () => {
    const { rulesApplied } = explainAccess({ viewer, target });
    await logEvent({
      eventType: 'ACCESS_EXPLANATION_VIEWED',
      severity: 'info',
      targetCollection: target.type,
      targetId: target.id,
      actorId: viewer.id,
      metadata: { rulesApplied },
    });
    setIsModalOpen(true);
  };

  const { explanation, rulesApplied } = explainAccess({ viewer, target });

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="text-xs text-gray-500 underline"
      >
        Why can I see this?
      </button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Why you can see this</h2>
        <p>{explanation}</p>
        <p>Access granted by: {rulesApplied.join(', ')}</p>
        {viewer.role === 'SUPPORT_ADMIN' && <p>Access logged for transparency.</p>}
      </Modal>
    </>
  );
}
