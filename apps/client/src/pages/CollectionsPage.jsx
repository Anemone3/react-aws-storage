import React from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useGetAllCollectionsQuery } from '../redux/services/collection-api';
import { useModal } from '../hooks/useModal';
import ModalPin from '../components/ModalPin';

function CollectionsPage() {
  const { userId } = useParams();

  const { data, isLoading } = useGetAllCollectionsQuery(userId);
  const { showModal } = useModal();
  const location = useLocation();
  const collections = data?.collections || [];

  const isOnCollectionsPage = location.pathname === `/collections/${userId}`;

  return (
    <section className="relative container mx-auto flex max-w-screen flex-col items-center justify-center space-y-4">
      <button
        onClick={() => showModal(<ModalPin collections={collections} userId={userId} />)}
        className="absolute top-5 right-6 cursor-pointer rounded-lg bg-pink-100 px-3 py-2 font-semibold text-slate-700 hover:bg-pink-300"
      >
        Create a Pin
      </button>
      {isOnCollectionsPage && (
        <h1 className="mt-5 bg-[url('/gradiend-bg@2x.png')] bg-cover bg-clip-text bg-center bg-no-repeat text-center text-6xl font-bold text-transparent">
          Collections
        </h1>
      )}

      <div className="mt-5 grid w-full grid-cols-3 gap-x-4 gap-y-10 min-[1340px]:mx-10 lg:container">
        {isLoading ? <p>Loading...</p> : <Outlet context={{ data, collections, userId }} />}
      </div>
    </section>
  );
}

export default CollectionsPage;
