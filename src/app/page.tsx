"use client";

import Link from "next/link";
import "./tailwind.css";
import { theme } from "@/styles/theme";
import Image from "next/image";

export default function Home() {
  return (
    <main className="landing-background">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
         marginTop: theme.spacing.lg,
          padding: "0 4rem",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            position: "relative",
          }}
        >
          <h1 className="landing-title coral">Pop Up.</h1>
          <h1 className="landing-title dark-blue">Stand Out.</h1>
          <h1 className="landing-title white">Own Success.</h1>

          <Image
            src="/images/underline.png"
            alt="Decorative underline"
            width={500}
            height={20}
            className="title-underline-image"
          />

          <p className="landing-description">
            a one-stop platform for finding events, managing applications, and
            connecting with a thriving vendor community.
          </p>
        </div>

        <div
          style={{
            position: "relative",
            width: "650px",
            height: "800px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "55%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src="/images/homeImage.png"
              alt="Vendor Shop Display"
              width={800}
              height={600}
              style={{
                objectFit: "contain",
                borderRadius: theme.borderRadius.lg,
                maxWidth: "100%",
                height: "auto",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "200px",
                height: "200px",
                backgroundColor: theme.colors.primary.coral,
                borderRadius: "50%",
                opacity: 0.2,
                zIndex: -1,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "150px",
                height: "150px",
                backgroundColor: theme.colors.secondary.yellow,
                borderRadius: "50%",
                opacity: 0.2,
                zIndex: -1,
              }}
            />
          </div>
        </div>
        
      </div>
      <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          marginTop: theme.spacing.sm,
          marginBottom: '50px',
          padding: '0 20px',
        }}>
        <div style={{
          width: '100%',
          textAlign: 'center',
        }}>
          <h1 className="landing-title dark-blue">
            Discover MarkitIt
          </h1>
          <p style={{
            fontFamily: theme.typography.fontFamily.primary,
            fontSize: theme.typography.fontSize.body,
            color: theme.colors.background.white,
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
          backgroundColor: theme.colors.primary.darkBlue,
          width: "100%",
          padding: 0,
          textAlign: "left",
          position: "relative",
          overflow: "hidden", 
          height: "200px",
          clipPath: "url(#concaveClip)",
          margin: 0,
          left: 0,
          right: 0,
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
          backgroundColor: theme.colors.primary.darkBlue,
          width: "100%",
          padding: `${theme.spacing.xl} ${theme.spacing.lg}`,
          textAlign: "left",
          position: "relative",
          overflow: "visible",
          margin: 0,
          left: 0,
          right: 0,
        }}
      >
        {/* Content container */}
        <div
          style={{
            gap: theme.spacing.lg,
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
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
                    fontSize: theme.typography.fontSize.body,
                    fontWeight: theme.typography.fontWeight.medium,
                    color: theme.colors.primary.coral,
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
                      backgroundColor: theme.colors.primary.coral,
                      color: theme.colors.background.white,
                      padding: theme.spacing.xs + " " + theme.spacing.sm,
                      borderRadius: theme.borderRadius.full,
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
    </main>
  );
}
