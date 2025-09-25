"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, Moon, Zap, CodeXml, Cpu, Terminal } from "lucide-react";
import {
  ConnectButton,
  lightTheme,
  MediaRenderer,
  TransactionButton,
} from "thirdweb/react";
import { client } from "../lib/client";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";
import { getContractMetadata } from "thirdweb/extensions/common";
import { claimTo } from "thirdweb/extensions/erc721";
import { useActiveAccount } from "thirdweb/react";

const mockNFTs = [
  {
    id: 1,
    image: "/images/first.png",
  },
  {
    id: 2,
    image: "/images/second.png",
  },
  {
    id: 3,
    image: "/images/third.png",
  },
  {
    id: 4,
    image: "/images/fourth.png",
  },
  {
    id: 5,
    image: "/images/fifth.png",
  },
];

export default function NerdMintLanding() {
  const [isDark, setIsDark] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const account = useActiveAccount();
  const contract = getContract({
    client,
    chain: sepolia,
    address: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as string,
  });

  const { data } = useReadContract(getContractMetadata, {
    contract: contract,
  });

  useEffect(() => {
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDark(systemPrefersDark);
  }, []);

  useEffect(() => {
    const html = document.querySelector("html");
    if (html) {
      if (isDark) {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
    }
  }, [isDark]);

  const connectWallet = async () => {
    try {
      // Mock wallet connection
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsConnected(true);
      setWalletAddress("0x1234...5678");
      alert("Wallet Connected! Successfully connected to your wallet.");
    } catch (error) {
      alert("Connection Failed. Failed to connect wallet. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CodeXml className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">NerdMint</h1>
          </div>

          <div className="flex items-center space-x-4">
            {isConnected && (
              <Badge variant="secondary" className="hidden sm:inline-flex">
                {walletAddress}
              </Badge>
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsDark(!isDark)}
              className="border-border hover:bg-accent"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <ConnectButton
              client={client}
              connectButton={{ label: "Connect Wallet" }}
              connectModal={{
                showThirdwebBranding: false,
                size: "wide",
                title: "NerdMint",
              }}
              theme={lightTheme({
                colors: {
                  modalBg: "hsl(114, 86%, 78%)",
                  borderColor: "hsl(0, 100%, 1%)", 
                  primaryButtonBg: "hsl(195, 100%, 26%)",
                  primaryButtonText: "hsl(0, 0%, 100%)",
                  primaryText: "hsl(257, 100%, 45%)",
                },
              })}
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12">
        {/* Hero Section */}
        <section className="container mx-auto px-4 text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-balance leading-tight">
            Mint your unique{" "}
            <span className="text-primary glow-effect">NerdMint</span> Dev
            Avatar NFT
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto text-pretty leading-relaxed">
            Join the exclusive collection of{" "}
            <span className="text-blue-400 text-2xl underline font-extrabold">
              {" "}
              7777{" "}
            </span>{" "}
            unique developer avatars. Each NFT represents a different coding
            archetype with rare traits and abilities.
          </p>

          <div className="flex items-center justify-center gap-6 mb-12">
            <Badge variant="secondary" className="text-sm py-2 px-4">
              <Zap className="h-3 w-3 mr-1" />
              DevNFTs
            </Badge>
            <Badge variant="outline" className="text-sm py-2 px-4">
              0.0001 ETH
            </Badge>
          </div>
        </section>

        {/* Mint Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="relative max-w-4xl mx-auto overflow-hidden">
            <div className="hidden lg:block relative">
              <div className="relative w-[500px] h-[500px] mx-auto">
                <div className="absolute inset-0 flex items-center justify-center">
                  <TransactionButton
                    transaction={() =>
                      claimTo({
                        contract,
                        to: account?.address as string,
                        quantity: BigInt(1),
                      })
                    }
                    onTransactionConfirmed={async () =>
                      alert("Transaction confirmed")
                    }
                    theme={lightTheme({
                      colors: {
                        primaryButtonBg: "hsl(195, 100%, 26%)",
                        primaryButtonText: "hsl(0, 0%, 100%)",
                        primaryText: "hsl(257, 100%, 45%)",
                      },
                    })}
                  >
                    <div className="flex flex-col items-center">
                      <Zap className="h-6 w-6 mb-1" />
                      <span>MINT</span>
                    </div>
                  </TransactionButton>
                </div>
                {mockNFTs.map((nft, index) => {
                  const angle = index * 72 - 90;
                  const x = Math.cos((angle * Math.PI) / 180) * 160;
                  const y = Math.sin((angle * Math.PI) / 180) * 160;

                  return (
                    <div
                      key={nft.id}
                      className="absolute w-24 h-24 transform -translate-x-1/2 -translate-y-1/2 float-animation"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        animationDelay: `${index * 0.2}s`,
                      }}
                    >
                      <div className="w-full h-full rounded-full border-2 border-secondary hover:border-primary transition-colors duration-300 overflow-hidden hover:scale-110 transform">
                        <Image
                          src={nft.image}
                          alt="nft"
                          width={100}
                          height={100}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="lg:hidden">
              <div className="flex justify-center mb-12">
                <TransactionButton
                  transaction={() =>
                    claimTo({
                      contract,
                      to: account?.address as string,
                      quantity: BigInt(1),
                    })
                  }
                  onTransactionConfirmed={async () =>
                    alert("Transaction confirmed!!!")
                  }
                  theme={lightTheme({
                    colors: {
                      primaryButtonBg: "hsl(195, 100%, 26%)",
                      primaryButtonText: "hsl(0, 0%, 100%)",
                      primaryText: "hsl(257, 100%, 45%)",
                    },
                  })}
                >
                  <div className="flex flex-col items-center">
                    <Zap className="h-6 w-6 mb-1" />
                    <span>MINT</span>
                  </div>
                </TransactionButton>
              </div>

              <div className="flex gap-4 justify-center flex-wrap px-4">
                {mockNFTs.map((nft, index) => (
                  <div
                    key={nft.id}
                    className="w-20 h-20 rounded-full border-2 border-secondary hover:border-primary transition-colors duration-300 overflow-hidden float-animation"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <Image src={nft.image} alt="nft" width={100} height={100} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 mt-20">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-card border-border text-center p-8">
              <Terminal className="h-12 w-12 text-secondary mx-auto mb-6" />
              <h3 className="text-lg font-semibold mb-4">Unique Traits</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Each avatar has randomized programming languages, experience
                levels, and specialties.
              </p>
            </Card>
            <Card className="bg-card border-border text-center p-8">
              <Cpu className="h-12 w-12 text-secondary mx-auto mb-6" />
              <h3 className="text-lg font-semibold mb-4">Limited Edition</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Only 7777 NerdMint avatars will ever exist. Get yours before
                they're gone!
              </p>
            </Card>
            <Card className="bg-card border-border text-center p-8">
              <CodeXml className="h-12 w-12 text-secondary mx-auto mb-6" />
              <h3 className="text-lg font-semibold mb-4">Community Access</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Join an exclusive community of developer NFT holders with
                special perks and events.
              </p>
            </Card>
          </div>
        </section>
      </main>
      <footer className="mt-20 border-t border-border bg-muted py-6 text-center text-sm text-muted-foreground">
        <p className="flex justify-center items-center gap-1">
          Made with
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-red-500"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
        4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 
        14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 
        6.86-8.55 11.54L12 21.35z"
            />
          </svg>
          using <span className="font-semibold text-primary">Next.js</span>,{" "}
          <span className="font-semibold text-primary">TypeScript</span>, and{" "}
          <span className="font-semibold text-primary">thirdweb</span>.
        </p>
        <p className="mt-2">
          Crafted by{" "}
          <a
            href="https://0xhparihar07.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-bold text-purple-400 hover:text-primary transition-colors"
          >
            0xhparihar07
          </a>{" "}
          — 2025
        </p>
      </footer>
    </div>
  );
}
