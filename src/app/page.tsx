"use client";

import Link from "next/link";
import "./tailwind.css";
import { theme } from '@/styles/theme';
import { EventSearchBar } from '@/components/EventSearchBar';
import Image from 'next/image';
import styles from './page.module.css';

export default function Home() {
  return (
    <main style={{
      background: theme.colors.background.gradient,
      minHeight: '100vh',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: theme.spacing.xl,
        marginBottom: '300px',
      }}>
        <div style={{
          maxWidth: '600px',
          position: 'absolute',
          left: '15%',
        }}>
          <h1 style={{
            fontFamily: theme.typography.fontFamily.primary,
            fontSize: theme.typography.fontSize.title,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.primary.coral,
            marginBottom: theme.spacing.md,
            lineHeight: 1.2,
          }}>
            Pop Up.
          </h1>
          <h1 style={{
            fontFamily: theme.typography.fontFamily.primary,
            fontSize: theme.typography.fontSize.title,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.primary.darkBlue,
            marginBottom: theme.spacing.md,
            lineHeight: 1.2,
          }}>
            Stand Out.
          </h1>
          <h1 style={{
            fontFamily: theme.typography.fontFamily.primary,
            fontSize: theme.typography.fontSize.title,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.background.white,
            marginBottom: theme.spacing.xl,
            lineHeight: 1.2,
          }}>
            Sell More.
            <Image
              src="/images/homeVector.png"
              alt="Vendor Shop Display"
              width={400}
              height={100}
              style={{
                objectFit: 'contain',
                borderRadius: theme.borderRadius.lg,
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          </h1>
          
          <p style={{
            fontFamily: theme.typography.fontFamily.primary,
            fontSize: theme.typography.fontSize.body,
            color: theme.colors.text.secondary,
            maxWidth: '450px',
            lineHeight: 1.5,
          }}>
            a one-stop platform for finding top-tier events, managing applications, and connecting with a thriving vendor community.
          </p>
        </div>

        <div style={{
          position: 'relative',
          width: '1200px',
          height: '800px',
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '110%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Image
              src="/images/homeImage.png"
              alt="Vendor Shop Display"
              width={800}
              height={600}
              style={{
                objectFit: 'contain',
                borderRadius: theme.borderRadius.lg,
                maxWidth: '100%',
                height: 'auto',
                marginTop: '300px', // Push the image down
              }}
            />
            {/* <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '200px',
              height: '200px',
              backgroundColor: theme.colors.primary.coral,
              borderRadius: '50%',
              opacity: 0.2,
              zIndex: -1,
            }} />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '150px',
              height: '150px',
              backgroundColor: theme.colors.secondary.yellow,
              borderRadius: '50%',
              opacity: 0.2,
              zIndex: -1,
            }} /> */}
          </div>
        </div>
        
      </div>
      <div style={{
          display: 'flex',
          justifyContent: 'center', // Center horizontally
          alignItems: 'center', // Center vertically
          marginTop: theme.spacing.sm,
          marginBottom: '200px auto',
        }}>
        <div style={{
          maxWidth: '600px',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontFamily: theme.typography.fontFamily.primary,
            fontSize: theme.typography.fontSize.title,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.primary.darkBlue,
            marginBottom: theme.spacing.md,
            lineHeight: 1.2,
          }}>
            Discover Markiit
          </h1>
          <p style={{
            fontFamily: theme.typography.fontFamily.primary,
            fontSize: theme.typography.fontSize.body,
            color: theme.colors.background.white,
            maxWidth: '450px',
            lineHeight: 1.5,
            margin: '0 auto',
            marginBottom: '0px',
          }}>
            These features make our platform
          </p>
        </div>
          
      </div>

      {/* Curve*/}
      <div
        style={{
          backgroundColor: theme.colors.primary.darkBlue, // Set the background to purple
          width: "100vw", // Make the background span the full width
          padding: theme.spacing.lg, // Add padding for spacing
          textAlign: "left",
          position: "relative",
          overflow: "hidden", 
          height: "200px",
          clipPath: "url(#concaveClip)",
        }}
      >
        
      <svg width="0" height="0">
        <defs>
          <clipPath id="concaveClip" clipPathUnits="objectBoundingBox">
            <path d="
              M0,0 
              C0.2,1 0.8,1 1,0 
              L1,1 
              L0,1 
              Z
            " />
          </clipPath>
        </defs>
      </svg>

      </div>
      {/* Features Section */}
      <div
        style={{
          backgroundColor: theme.colors.primary.darkBlue, // Set the background to purple
          width: "100vw", // Make the background span the full width
          padding: theme.spacing.lg, // Add padding for spacing
          textAlign: "left",
          position: "relative",
          overflow: "hidden", 
        }}
      >
        {/* Concave Curve at Top */}
        {/* <div style={{ position: "absolute", top: 0, left: 0, width: "100%" }}>
          <svg
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            style={{
              display: "block",
              width: "100%",
              height: "200px",
              transform: "rotate(180deg)",
            }}
          >
            <path
              d="M0,100 C480,0 960,0 1440,100"
              fill='white'
              strokeWidth="100"
            />
          </svg>
        </div> */}
        <div
          style={{
            gap: theme.spacing.lg,
            maxWidth: "750px", // Center the content within a container
            margin: "0 auto", // Center the grid horizontally
          }}
        >
          {[
            {
              title: "Event Matching",
              desc: "Discover the best pop-ups for your brand with AI-powered event recommendations.",
              img: "/images/eventMatchingIcon.png",
            },
            {
              title: "Fast Applications",
              desc: "Apply to multiple events instantly with auto-filled details and status tracking.",
              img: "/images/fastApplicationIcon.png",
            },
            {
              title: "Financial Calculator",
              desc: "Plan smarter with cost breakdowns and ROI predictions to maximize your earnings.",
              img: "/images/financialCalculatorIcon.png",
            },
            {
              title: "Host Rating",
              desc: "Avoid bad experiences with verified vendor reviews and a trust-based host vetting system.",
              img: "/images/hostRatingIcon.png",
            },
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "flex-start",
                marginBottom: '70px',
                gap: theme.spacing.sm,
              }}
            >
              <div
                style={{
                  width: "120px", // Fixed width for the column
                  flexShrink: 0, // Prevent the column from shrinking
                }}
              >
                <Image
                  src={feature.img}
                  alt={`${feature.title} Icon`}
                  width={100}
                  height={100}
                  style={{
                    objectFit: "contain",
                    borderRadius: theme.borderRadius.lg,
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
              </div>

              <div>
                <h3
                  style={{
                    fontFamily: theme.typography.fontFamily.primary,
                    fontSize: theme.typography.fontSize.subtitle,
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: theme.colors.primary.red,
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  {feature.title}
                </h3>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: theme.spacing.md,
                  }}
                >
                  <button
                    style={{
                      marginTop: theme.spacing.xs,
                      marginBottom: theme.spacing.sm,
                      fontSize: theme.typography.fontSize.body,
                      backgroundColor: theme.colors.primary.red,
                      color: theme.colors.background.white,
                      padding: `${theme.spacing.xs} ${theme.spacing.lg}`,
                      borderRadius: theme.borderRadius.md,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    EXPLORE
                  </button>
                  <p
                    style={{
                      fontFamily: theme.typography.fontFamily.primary,
                      fontSize: theme.typography.fontSize.body,
                      color: theme.colors.background.white,
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {feature.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Placeholder Boxes */}
      <section className="py-20 px-72 grid grid-cols-1 md:grid-cols-3 gap-40">
        {[1, 2, 3].map((box, index) => (
          <div
            key={index}
            className="bg-yellow-400 rounded-2xl shadow-lg relative overflow-hidden"
            style={{
              paddingTop: "100%", // Maintain a square aspect ratio
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Content inside the box */}
              <p className="text-white font-bold">Box {index + 1}</p>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
