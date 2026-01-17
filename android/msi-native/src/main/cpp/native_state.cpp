/**
 * MSI Native State - NDK stub for fast addressable state buffers
 * 
 * Provides zero-copy-ish memory operations for high-performance use cases:
 * - Camera frames
 * - DSP blocks
 * - Neural network tensors
 * - Sensor data streams
 * 
 * Future: Upgrade to AHardwareBuffer / ASharedMemory for true zero-copy
 */

#include <jni.h>
#include <cstdint>
#include <cstdlib>
#include <cstring>
#include <android/log.h>

#define LOG_TAG "MSI-Native"
#define LOGI(...) __android_log_print(ANDROID_LOG_INFO, LOG_TAG, __VA_ARGS__)
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR, LOG_TAG, __VA_ARGS__)

extern "C" {

/**
 * Allocates a native memory buffer.
 * @param bytes Size in bytes
 * @return Pointer as jlong (0 on failure)
 */
JNIEXPORT jlong JNICALL
Java_com_singularis_msi_NativeState_alloc(JNIEnv* env, jclass clazz, jint bytes) {
    if (bytes <= 0) {
        LOGE("alloc: invalid size %d", bytes);
        return 0;
    }
    
    void* ptr = std::malloc(static_cast<size_t>(bytes));
    if (ptr == nullptr) {
        LOGE("alloc: failed to allocate %d bytes", bytes);
        return 0;
    }
    
    // Zero-initialize for safety
    std::memset(ptr, 0, static_cast<size_t>(bytes));
    
    LOGI("alloc: %d bytes at %p", bytes, ptr);
    return reinterpret_cast<jlong>(ptr);
}

/**
 * Frees a native memory buffer.
 * @param ptr Pointer from alloc()
 */
JNIEXPORT void JNICALL
Java_com_singularis_msi_NativeState_free(JNIEnv* env, jclass clazz, jlong ptr) {
    if (ptr == 0) {
        LOGE("free: null pointer");
        return;
    }
    
    void* p = reinterpret_cast<void*>(ptr);
    std::free(p);
    LOGI("free: %p", p);
}

/**
 * Writes data to a native buffer.
 * @param ptr Pointer from alloc()
 * @param offset Byte offset
 * @param data Byte array to write
 */
JNIEXPORT void JNICALL
Java_com_singularis_msi_NativeState_write(JNIEnv* env, jclass clazz, 
                                           jlong ptr, jint offset, jbyteArray data) {
    if (ptr == 0) {
        LOGE("write: null pointer");
        return;
    }
    
    void* p = reinterpret_cast<void*>(ptr);
    jsize len = env->GetArrayLength(data);
    jbyte* src = env->GetByteArrayElements(data, nullptr);
    
    if (src == nullptr) {
        LOGE("write: failed to get byte array elements");
        return;
    }
    
    std::memcpy(static_cast<uint8_t*>(p) + offset, src, static_cast<size_t>(len));
    env->ReleaseByteArrayElements(data, src, JNI_ABORT);
}

/**
 * Reads data from a native buffer.
 * @param ptr Pointer from alloc()
 * @param offset Byte offset
 * @param len Number of bytes to read
 * @return Byte array
 */
JNIEXPORT jbyteArray JNICALL
Java_com_singularis_msi_NativeState_read(JNIEnv* env, jclass clazz,
                                          jlong ptr, jint offset, jint len) {
    if (ptr == 0) {
        LOGE("read: null pointer");
        return nullptr;
    }
    
    void* p = reinterpret_cast<void*>(ptr);
    jbyteArray out = env->NewByteArray(len);
    
    if (out == nullptr) {
        LOGE("read: failed to allocate output array");
        return nullptr;
    }
    
    env->SetByteArrayRegion(out, 0, len, 
                            reinterpret_cast<jbyte*>(static_cast<uint8_t*>(p) + offset));
    return out;
}

/**
 * Copies data between native buffers (for zero-copy-ish transfers).
 * @param srcPtr Source pointer
 * @param srcOffset Source offset
 * @param dstPtr Destination pointer
 * @param dstOffset Destination offset
 * @param len Number of bytes
 */
JNIEXPORT void JNICALL
Java_com_singularis_msi_NativeState_copy(JNIEnv* env, jclass clazz,
                                          jlong srcPtr, jint srcOffset,
                                          jlong dstPtr, jint dstOffset,
                                          jint len) {
    if (srcPtr == 0 || dstPtr == 0) {
        LOGE("copy: null pointer");
        return;
    }
    
    void* src = reinterpret_cast<void*>(srcPtr);
    void* dst = reinterpret_cast<void*>(dstPtr);
    
    std::memcpy(static_cast<uint8_t*>(dst) + dstOffset,
                static_cast<uint8_t*>(src) + srcOffset,
                static_cast<size_t>(len));
}

/**
 * Fills a native buffer with a value (for initialization).
 * @param ptr Pointer from alloc()
 * @param offset Byte offset
 * @param len Number of bytes
 * @param value Fill value (0-255)
 */
JNIEXPORT void JNICALL
Java_com_singularis_msi_NativeState_fill(JNIEnv* env, jclass clazz,
                                          jlong ptr, jint offset, jint len, jint value) {
    if (ptr == 0) {
        LOGE("fill: null pointer");
        return;
    }
    
    void* p = reinterpret_cast<void*>(ptr);
    std::memset(static_cast<uint8_t*>(p) + offset, 
                static_cast<int>(value & 0xFF), 
                static_cast<size_t>(len));
}

/**
 * Gets the size of a native type (for alignment purposes).
 */
JNIEXPORT jint JNICALL
Java_com_singularis_msi_NativeState_sizeofFloat(JNIEnv* env, jclass clazz) {
    return static_cast<jint>(sizeof(float));
}

/**
 * Writes a float array to native buffer (for embeddings/tensors).
 */
JNIEXPORT void JNICALL
Java_com_singularis_msi_NativeState_writeFloats(JNIEnv* env, jclass clazz,
                                                 jlong ptr, jint offset, jfloatArray data) {
    if (ptr == 0) {
        LOGE("writeFloats: null pointer");
        return;
    }
    
    void* p = reinterpret_cast<void*>(ptr);
    jsize len = env->GetArrayLength(data);
    jfloat* src = env->GetFloatArrayElements(data, nullptr);
    
    if (src == nullptr) {
        LOGE("writeFloats: failed to get float array elements");
        return;
    }
    
    std::memcpy(static_cast<uint8_t*>(p) + offset, src, 
                static_cast<size_t>(len) * sizeof(float));
    env->ReleaseFloatArrayElements(data, src, JNI_ABORT);
}

/**
 * Reads a float array from native buffer (for embeddings/tensors).
 */
JNIEXPORT jfloatArray JNICALL
Java_com_singularis_msi_NativeState_readFloats(JNIEnv* env, jclass clazz,
                                                jlong ptr, jint offset, jint count) {
    if (ptr == 0) {
        LOGE("readFloats: null pointer");
        return nullptr;
    }
    
    void* p = reinterpret_cast<void*>(ptr);
    jfloatArray out = env->NewFloatArray(count);
    
    if (out == nullptr) {
        LOGE("readFloats: failed to allocate output array");
        return nullptr;
    }
    
    env->SetFloatArrayRegion(out, 0, count,
                             reinterpret_cast<jfloat*>(static_cast<uint8_t*>(p) + offset));
    return out;
}

} // extern "C"
