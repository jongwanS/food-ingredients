import React, { useEffect, useRef } from 'react';

interface AdProps {
  className?: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  slot?: string;
}

/**
 * GoogleAd 컴포넌트 - 구글 애드센스 광고를 표시합니다.
 * 
 * @param {string} className - 추가적인 CSS 클래스
 * @param {string} format - 광고 형식: 'auto', 'horizontal', 'vertical', 'rectangle' 
 * @param {string} slot - 구글 애드센스 광고 슬롯 ID
 * 
 * 사용 예시: 
 * <GoogleAd format="horizontal" slot="1234567890" />
 */
export function GoogleAd({ className, format = 'auto', slot = '1234567890' }: AdProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      // AdSense 초기화 확인
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        // 새로운 광고 삽입
        const adElement = document.createElement('ins');
        
        adElement.className = 'adsbygoogle';
        adElement.style.display = 'block';
        adElement.style.textAlign = 'center';
        
        // 광고 형식에 따른 설정
        adElement.dataset.adClient = 'ca-pub-1234567890123456'; // AdSense 퍼블리셔 ID
        adElement.dataset.adSlot = slot;
        
        // 형식에 따른 크기 설정
        if (format === 'horizontal') {
          adElement.style.width = '100%';
          adElement.style.height = '90px';
          adElement.dataset.adFormat = 'horizontal';
        } else if (format === 'vertical') {
          adElement.style.width = '160px';
          adElement.style.height = '600px';
          adElement.dataset.adFormat = 'vertical';
        } else if (format === 'rectangle') {
          adElement.style.width = '300px';
          adElement.style.height = '250px';
          adElement.dataset.adFormat = 'rectangle';
        } else {
          adElement.style.width = '100%';
          adElement.style.height = 'auto';
          adElement.dataset.adFormat = 'auto';
          adElement.dataset.fullWidthResponsive = 'true';
        }
        
        // 기존 콘텐츠 제거 후 새 광고 삽입
        if (adRef.current) {
          adRef.current.innerHTML = '';
          adRef.current.appendChild(adElement);
          
          // 광고 로드
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        }
      }
    } catch (error) {
      console.error('광고 로드 중 오류 발생:', error);
    }
  }, [format, slot]);

  return (
    <div ref={adRef} className={`ad-container my-4 ${className || ''}`}>
      <div className="text-xs text-gray-400 text-center mb-1">Sponsored</div>
    </div>
  );
}

/**
 * InArticleAd 컴포넌트 - 콘텐츠 중간에 삽입되는 광고를 표시합니다.
 */
export function InArticleAd({ className }: AdProps) {
  return (
    <GoogleAd 
      className={`in-article-ad ${className || ''}`} 
      format="rectangle" 
      slot="1234567890" 
    />
  );
}

/**
 * SidebarAd 컴포넌트 - 사이드바에 표시되는 세로형 광고를 표시합니다.
 */
export function SidebarAd({ className }: AdProps) {
  return (
    <GoogleAd 
      className={`sidebar-ad ${className || ''}`} 
      format="vertical" 
      slot="1234567890" 
    />
  );
}

/**
 * BannerAd 컴포넌트 - 페이지 상단/하단에 표시되는 가로형 배너 광고를 표시합니다.
 */
export function BannerAd({ className }: AdProps) {
  return (
    <GoogleAd 
      className={`banner-ad ${className || ''}`} 
      format="horizontal" 
      slot="1234567890" 
    />
  );
}

/**
 * ResponsiveAd 컴포넌트 - 반응형 광고를 표시합니다.
 */
export function ResponsiveAd({ className }: AdProps) {
  return (
    <GoogleAd 
      className={`responsive-ad ${className || ''}`} 
      format="auto" 
      slot="1234567890" 
    />
  );
}