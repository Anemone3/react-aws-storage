import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useGetAllCollectionsQuery } from '../redux/services/collection-api';
import { useModal } from '../hooks/useModal';
import ModalPin from '../components/ModalPin';
import { useSelector } from 'react-redux';

function CollectionsPage() {
  const { userId } = useParams();
  const accessToken = useSelector(state => state.auth.accessToken);

  const { data, isLoading, refetch } = useGetAllCollectionsQuery(userId);
  /* Podria manejar si esta logeado y depende de ese estado la ejecución del refetch */
  useEffect(() => {
    if (accessToken !== undefined) {
      refetch();
    }
  }, [accessToken]);

  const { showModal } = useModal();
  const location = useLocation();

  const isOnCollectionsPage = location.pathname === `/collections/${userId}`;

  return (
    <section className="relative container mx-auto flex max-w-screen flex-col items-center justify-center space-y-4">
      <button
        onClick={() => showModal(<ModalPin collections={data?.collections || []} userId={userId} />)}
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
        {isLoading && data ? <div> linz </div> : <Outlet context={{ collections: data?.collections, userId }} />}
      </div>
    </section>
  );
}

export default CollectionsPage;
