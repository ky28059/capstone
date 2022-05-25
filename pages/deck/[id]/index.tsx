import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../components/Header';
import prisma from '../../../lib/prisma';
import { currentUser } from '../../../util/helpers';
import { useRouter } from 'next/router';
import CreateDeckModal from '../../../components/CreateDeckModal';
import { useState } from 'react';

export async function getServerSideProps(context) {
    const id = Number(context.query.id);
    const deck = await prisma.deck.findUnique({
        where: {
            id: id,
        },
    });
    return {
        props: { deck }
    }
}

export default ({deck}) => {
    const router = useRouter();
    const cards = deck.cards.map(e => JSON.parse(e));
    const [open, setOpen] = useState(false);

    const editDeck = async () => {

    }

    return (
        <div>
            <Head>
                <title>{deck.title} | Capstone</title>
                <meta name="description" content="Decks. -Kepler" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />

            <main className="container">
                <div className="flex flex-col divide-y-2 divide-gray-400">
                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold">{deck.title}</span>
                        <span className="text-gray-500">Created by {deck.creatorName}</span>
                    </div>
                    <p className="text-gray-500 mb-6">{deck.description}</p>
                </div>

                <div className="flex gap-1">
                    <Link href="/decks">
                        <button className="px-2.5 py-1 font-medium bg-gradient-to-b from-red-500 to-pink-600 text-white rounded-lg mb-6">
                            Back
                        </button>
                    </Link>
                    {currentUser() === deck.creatorName && (
                        <>
                            <button onClick={() => setOpen(true)} className="px-2.5 py-1 font-medium bg-gradient-to-b from-red-500 to-pink-600 text-white rounded-lg mb-6">
                                Edit deck
                            </button>
                            <CreateDeckModal new={false} isOpen={open} setIsOpen={setOpen} callback={editDeck} />
                        </>
                    )}
                    <Link href={router.asPath + "/study"}>
                        <button className="px-2.5 py-1 font-medium bg-gradient-to-b from-red-500 to-pink-600 text-white rounded-lg mb-6">
                            Study cards
                        </button>
                    </Link>
                </div>

                <h3 className="text-xl font-bold mb-2">Card list</h3>
                <section className="flex flex-col divide-y">
                    <div className="grid grid-cols-2">
                        <span className="font-bold">Front</span>
                        <span className="font-bold">Back</span>
                    </div>

                    {cards.map(e => (
                        <div className="grid grid-cols-2 break-all">
                            <span className="line-clamp-3 pr-4">{e.front}</span>
                            <span className="line-clamp-3 pr-4">{e.back}</span>
                        </div>
                    ))}
                </section>

            </main>
        </div>
    )
}
