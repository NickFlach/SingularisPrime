package com.singularis.msi

/**
 * Kotlin wrapper for native state buffers.
 * Provides high-performance memory operations via JNI.
 * 
 * Use this for:
 * - Camera frame buffers
 * - Audio DSP blocks
 * - Neural network tensors
 * - High-frequency sensor data
 */
object NativeState {
    
    init {
        System.loadLibrary("msi_native")
    }

    /**
     * Allocates a native memory buffer.
     * @param bytes Size in bytes
     * @return Pointer handle (0 on failure)
     */
    external fun alloc(bytes: Int): Long

    /**
     * Frees a native memory buffer.
     * @param ptr Pointer from alloc()
     */
    external fun free(ptr: Long)

    /**
     * Writes data to a native buffer.
     * @param ptr Pointer from alloc()
     * @param offset Byte offset
     * @param data Byte array to write
     */
    external fun write(ptr: Long, offset: Int, data: ByteArray)

    /**
     * Reads data from a native buffer.
     * @param ptr Pointer from alloc()
     * @param offset Byte offset
     * @param len Number of bytes to read
     * @return Byte array
     */
    external fun read(ptr: Long, offset: Int, len: Int): ByteArray

    /**
     * Copies data between native buffers.
     */
    external fun copy(srcPtr: Long, srcOffset: Int, dstPtr: Long, dstOffset: Int, len: Int)

    /**
     * Fills a native buffer with a value.
     */
    external fun fill(ptr: Long, offset: Int, len: Int, value: Int)

    /**
     * Gets sizeof(float) for alignment.
     */
    external fun sizeofFloat(): Int

    /**
     * Writes float array to native buffer.
     */
    external fun writeFloats(ptr: Long, offset: Int, data: FloatArray)

    /**
     * Reads float array from native buffer.
     */
    external fun readFloats(ptr: Long, offset: Int, count: Int): FloatArray
}

/**
 * RAII wrapper for native state buffers.
 * Automatically frees memory when closed.
 */
class NativeBuffer(val size: Int) : AutoCloseable {
    
    val ptr: Long = NativeState.alloc(size)
    
    init {
        if (ptr == 0L) {
            throw OutOfMemoryError("Failed to allocate $size bytes of native memory")
        }
    }

    fun write(offset: Int, data: ByteArray) {
        require(offset >= 0 && offset + data.size <= size) { "Write out of bounds" }
        NativeState.write(ptr, offset, data)
    }

    fun read(offset: Int, len: Int): ByteArray {
        require(offset >= 0 && offset + len <= size) { "Read out of bounds" }
        return NativeState.read(ptr, offset, len)
    }

    fun writeFloats(offset: Int, data: FloatArray) {
        val byteLen = data.size * NativeState.sizeofFloat()
        require(offset >= 0 && offset + byteLen <= size) { "Write out of bounds" }
        NativeState.writeFloats(ptr, offset, data)
    }

    fun readFloats(offset: Int, count: Int): FloatArray {
        val byteLen = count * NativeState.sizeofFloat()
        require(offset >= 0 && offset + byteLen <= size) { "Read out of bounds" }
        return NativeState.readFloats(ptr, offset, count)
    }

    fun fill(value: Int) {
        NativeState.fill(ptr, 0, size, value)
    }

    fun copyTo(dest: NativeBuffer, srcOffset: Int = 0, dstOffset: Int = 0, len: Int = size) {
        require(srcOffset + len <= size) { "Source out of bounds" }
        require(dstOffset + len <= dest.size) { "Destination out of bounds" }
        NativeState.copy(ptr, srcOffset, dest.ptr, dstOffset, len)
    }

    override fun close() {
        if (ptr != 0L) {
            NativeState.free(ptr)
        }
    }
}
