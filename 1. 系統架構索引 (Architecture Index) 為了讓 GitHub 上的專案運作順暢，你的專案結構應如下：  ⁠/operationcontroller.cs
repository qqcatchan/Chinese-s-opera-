using UnityEngine;
using UnityEngine.UI; // 如果你係喺 UI 顯示圖片就要用呢個

public class OperaController : MonoBehaviour
{
    // 角色渲染器，顯示緊個公仔個頭/衫
    public SpriteRenderer characterFaceRenderer; 
    
    // 放入你的圖片素材
    public Sprite[] operaFaces = new Sprite[5]; // 對應 image.png - image_5.png
    public AudioSource audioSource;
    public AudioClip[] operaMusic = new AudioClip[2]; 

    // 換面核心功能
    public void ChangeFaceAndPlay(int imageIndex, int musicIndex)
    {
        // 1. 換面 / 換裝 (Overlay)
        if(imageIndex < operaFaces.Length)
        {
            characterFaceRenderer.sprite = operaFaces[imageIndex];
            Debug.Log("已切換視覺素材: " + operaFaces[imageIndex].name);
        }

        // 2. 播曲與節奏同步
        if(musicIndex < operaMusic.Length)
        {
            audioSource.clip = operaMusic[musicIndex];
            audioSource.Play();
            Debug.Log("音樂同步啟動: " + operaMusic[musicIndex].name);
        }
    }
}
