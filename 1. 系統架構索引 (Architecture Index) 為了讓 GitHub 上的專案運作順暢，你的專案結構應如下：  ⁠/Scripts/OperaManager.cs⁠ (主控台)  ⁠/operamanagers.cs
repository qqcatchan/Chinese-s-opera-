using UnityEngine;

public class OperaManager : MonoBehaviour
{
    public SpriteRenderer overlaySprite; // 負責「換面」的 Sprite
    public AudioSource audioSource;
    
    public Sprite[] allImages; // 拖入你的 5 張圖
    public AudioClip[] allMusic; // 拖入你的 2 首曲

    // 呼叫此函數進行「一鍵同步」
    public void PerformOpera(int imageIndex, int musicIndex)
    {
        // 1. 換面 (Overlay)
        if(imageIndex < allImages.Length)
            overlaySprite.sprite = allImages[imageIndex];

        // 2. 播曲與同步
        audioSource.Stop();
        audioSource.clip = allMusic[musicIndex];
        audioSource.Play();
        
        Debug.Log($"表演開始: 畫面 {imageIndex} + 音樂 {musicIndex}");
    }
}
